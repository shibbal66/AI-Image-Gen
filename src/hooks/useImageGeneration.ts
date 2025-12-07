import { useCallback } from "react";
import { generateImage } from "../services/imageGenerationService";
import { useImageStore } from "../store/imageStore";
import { useRecentImagesStore } from "../store/recentImagesStore";
import { saveImageToSupabase } from "../services/supabaseService";
import type { GeneratedImage } from "../components/ImageGrid";
import { useToast } from "./useToast";

export function useImageGeneration() {
  const { addImage, setLoading, clearError, isLoading } = useImageStore();
  const { addImage: addRecentImage } = useRecentImagesStore();
  const { toast } = useToast();

  const generate = useCallback(
    async (prompt: string) => {
      if (isLoading) return;

      setLoading(true);
      clearError();

      try {
        const response = await generateImage({ prompt });

        const tempId = Date.now().toString();
        const tempImage: GeneratedImage = {
          id: tempId,
          imageUrl: response.imageUrl,
          prompt: response.prompt,
          timestamp: new Date(),
        };

        // Add to local store immediately
        addImage(tempImage);

        // Save to Supabase
        try {
          const metadata = {
            generated_at: new Date().toISOString(),
            source: "nanobanana",
          };
          const savedRecord = await saveImageToSupabase(tempImage, metadata);
          
          // Update the image with the Supabase ID
          const savedImage: GeneratedImage = {
            id: savedRecord.id,
            imageUrl: savedRecord.image_url,
            prompt: savedRecord.prompt,
            timestamp: new Date(savedRecord.created_at),
          };
          
          // Also add to recent images store with the correct ID
          addRecentImage(savedImage);
          
          toast({
            variant: "default",
            title: "Image generated successfully",
            description: "Image has been saved to your gallery",
          });
        } catch (supabaseError) {
          console.error("Failed to save to Supabase:", supabaseError);
          // Don't fail the whole operation if Supabase save fails
          toast({
            variant: "destructive",
            title: "Image generated but save failed",
            description: "Image was generated but couldn't be saved to gallery",
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate image";
        
        // Show error in toast notification
        toast({
          variant: "destructive",
          title: "Error generating image",
          description: errorMessage,
        });
        
        console.error("Image generation error:", err);
      } finally {
        setLoading(false);
      }
    },
    [isLoading, setLoading, clearError, addImage, addRecentImage, toast]
  );

  return {
    generate,
    isLoading,
  };
}
