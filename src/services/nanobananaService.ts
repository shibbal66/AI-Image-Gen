// Get API key from environment variables
const apiKey = import.meta.env.VITE_NANOBANANA_API_KEY;

if (!apiKey) {
  throw new Error(
    "VITE_NANOBANANA_API_KEY is not set. Please add it to your .env.local file."
  );
}

const API_BASE_URL = "https://api.nanobananaapi.ai/api/v1/nanobanana";

export interface NanoBananaGenerateParams {
  prompt: string;
  type?: "TEXTTOIAMGE" | "TEXTTOIMAGE";
  numImages?: number;
  callBackUrl?: string;
}

export interface NanoBananaTaskResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

export interface NanoBananaStatusResponse {
  code?: number;
  msg?: string;
  data?: {
    taskId?: string;
    successFlag: 0 | 1 | 2 | 3; // 0: generating, 1: completed, 2: create task failed, 3: generation failed
    response?: {
      resultImageUrl?: string;
      resultImageUrls?: string[];
      originImageUrl?: string | null;
    };
    errorMessage?: string;
    errorCode?: string | null;
  };
  // Also support flat structure for backward compatibility
  successFlag?: 0 | 1 | 2 | 3;
  response?: {
    resultImageUrl?: string;
    resultImageUrls?: string[];
  };
  errorMessage?: string;
}

/**
 * Submit an image generation task to NanoBanana API
 */
async function submitTask(
  params: NanoBananaGenerateParams
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: params.prompt,
      type: params.type || "TEXTTOIAMGE",
      numImages: params.numImages || 1,
      callBackUrl: params.callBackUrl,
    }),
  });

  const result: NanoBananaTaskResponse = await response.json();

  if (response.ok && result.code === 200) {
    return result.data.taskId;
  } else {
    throw new Error(result.msg || "Failed to submit image generation task");
  }
}

/**
 * Check the status of a task
 */
async function checkTaskStatus(taskId: string): Promise<NanoBananaStatusResponse> {
  const url = `${API_BASE_URL}/record-info?taskId=${taskId}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  
  // Debug logging (can be removed in production)
  if (process.env.NODE_ENV === "development") {
    console.log(`[NanoBanana] Status check for task ${taskId}:`, {
      status: response.status,
      response: result,
    });
  }

  // Handle error responses from the API
  if (!response.ok) {
    // If it's a 404 or 500, the task might still be processing
    // Return a status indicating it's still generating
    if (response.status === 404 || response.status === 500) {
      return {
        data: {
          successFlag: 0, // Still generating
        },
      };
    }
    
    // For other errors, throw
    const errorMsg = result.message || result.error || result.msg || response.statusText;
    throw new Error(`Failed to check task status: ${errorMsg}`);
  }

  // The API returns data nested in a 'data' property when code === 200
  // Structure: { code: 200, msg: "success", data: { successFlag: 1, response: {...} } }
  if (result.code === 200 && result.data) {
    return result as NanoBananaStatusResponse;
  }

  // Check if the response has a flat structure (backward compatibility)
  if (result.successFlag !== undefined) {
    return result as NanoBananaStatusResponse;
  }

  // If response structure is different, try to parse it
  if (result.data) {
    const data = result.data;
    if (data.status === "completed") {
      return {
        data: {
          successFlag: 1,
          response: {
            resultImageUrl: data.imageUrl,
            resultImageUrls: data.imageUrls,
          },
        },
      };
    } else if (data.status === "failed") {
      return {
        data: {
          successFlag: 3,
          errorMessage: result.msg || "Image generation failed",
        },
      };
    }
  }

  // Default: assume still generating
  return {
    data: {
      successFlag: 0,
    },
  };
}

/**
 * Poll for task completion with exponential backoff
 */
async function pollTaskStatus(
  taskId: string,
  maxWaitTime: number = 300000, // 5 minutes default
  pollInterval: number = 3000 // 3 seconds default
): Promise<string> {
  const startTime = Date.now();
  
  // Wait a bit before first check - task might not be immediately available
  await new Promise((resolve) => setTimeout(resolve, 2000));

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const statusResponse = await checkTaskStatus(taskId);

      // Handle nested structure (data.successFlag)
      const successFlag = statusResponse.data?.successFlag ?? statusResponse.successFlag;
      const responseData = statusResponse.data?.response ?? statusResponse.response;
      const errorMessage = statusResponse.data?.errorMessage ?? statusResponse.errorMessage;

      // Debug logging
      if (process.env.NODE_ENV === "development") {
        console.log(`[NanoBanana] Polling status for task ${taskId}:`, {
          successFlag,
          hasResponseData: !!responseData,
          resultImageUrl: responseData?.resultImageUrl,
        });
      }

      switch (successFlag) {
        case 0:
          // Task is generating, continue polling
          break;
        case 1:
          // Task completed successfully
          if (responseData?.resultImageUrl) {
            return responseData.resultImageUrl;
          } else if (
            responseData?.resultImageUrls &&
            responseData.resultImageUrls.length > 0
          ) {
            return responseData.resultImageUrls[0];
          } else {
            throw new Error("No image URL found in completed task");
          }
        case 2:
          // Create task failed
          throw new Error(
            errorMessage || "Task creation failed"
          );
        case 3:
          // Generation failed
          throw new Error(
            errorMessage || "Image generation failed"
          );
        default:
          throw new Error("Unknown task status");
      }
    } catch (error: unknown) {
      // Log the error for debugging
      console.warn(`Error checking task status (will retry):`, error);
      
      // If it's a final error (not a retry case), throw it
      if (error instanceof Error) {
        const errorMessage = error.message;
        if (
          (errorMessage.includes("Failed to check task status") && 
           !errorMessage.includes("404") && 
           !errorMessage.includes("500")) ||
          errorMessage.includes("Task creation") ||
          errorMessage.includes("Generation failed")
        ) {
          throw error;
        }
      }
      // For 404/500 errors or other temporary errors, continue polling
      // The task might still be processing
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error(
    "Image generation timed out. Please try again later."
  );
}

/**
 * Generate an image using NanoBanana API
 */
export async function generateImageWithNanoBanana(
  prompt: string,
  numImages: number = 1
): Promise<string> {
  try {
    // Submit the task
    const taskId = await submitTask({
      prompt,
      type: "TEXTTOIAMGE",
      numImages,
    });

    // Poll for completion
    const imageUrl = await pollTaskStatus(taskId);

    return imageUrl;
  } catch (error: unknown) {
    console.error("NanoBanana API error:", error);
    
    let errorMessage = "Failed to generate image";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === "object") {
      const errorObj = error as any;
      errorMessage = errorObj.msg || errorObj.message || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
}
