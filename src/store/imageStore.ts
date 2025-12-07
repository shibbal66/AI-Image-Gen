import { create } from "zustand";
import type { GeneratedImage } from "../components/ImageGrid";

export interface ImageState {
  images: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
  addImage: (image: GeneratedImage) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearImages: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  images: [],
  isLoading: false,
  error: null,
  addImage: (image) =>
    set((state) => ({
      images: [image, ...state.images],
    })),
  setLoading: (loading) =>
    set(() => ({
      isLoading: loading,
    })),
  setError: (error) =>
    set(() => ({
      error,
    })),
  clearError: () =>
    set(() => ({
      error: null,
    })),
  clearImages: () =>
    set(() => ({
      images: [],
    })),
}));

// Helper selector for better type inference
export const selectImages = (state: ImageState) => state.images;
