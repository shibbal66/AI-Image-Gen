import { create } from "zustand";
import type { GeneratedImage } from "../components/ImageGrid";
import { fetchImagesFromSupabase } from "../services/supabaseService";

export interface RecentImagesState {
  images: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
  fetchImages: () => Promise<void>;
  addImage: (image: GeneratedImage) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useRecentImagesStore = create<RecentImagesState>((set) => ({
  images: [],
  isLoading: false,
  error: null,
  fetchImages: async () => {
    set({ isLoading: true, error: null });
    try {
      const images = await fetchImagesFromSupabase();
      set({ images, isLoading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch images";
      set({ error: errorMessage, isLoading: false });
    }
  },
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
}));
