import { generateImageWithNanoBanana } from "./nanobananaService";

export interface GenerateImageParams {
  prompt: string;
  numImages?: number;
}

export interface GenerateImageResponse {
  imageUrl: string;
  prompt: string;
}

/**
 * Generate an image using NanoBanana API
 * @param params - The parameters for image generation
 * @returns Promise with the generated image URL and prompt
 */
export async function generateImage(
  params: GenerateImageParams
): Promise<GenerateImageResponse> {
  try {
    const { prompt, numImages = 1 } = params;

    // Use NanoBanana service to generate image
    const imageUrl = await generateImageWithNanoBanana(prompt, numImages);

    return {
      imageUrl,
      prompt,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    
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
