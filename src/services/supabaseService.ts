import { supabase } from '../lib/supabase'
import type { GeneratedImage } from '../components/ImageGrid'

export interface ImageRecord {
  id: string
  image_url: string
  prompt: string
  metadata?: Record<string, any>
  created_at: string
}

/**
 * Save an image to Supabase
 */
export async function saveImageToSupabase(
  image: GeneratedImage,
  metadata?: Record<string, any>
): Promise<ImageRecord> {
  const { data, error } = await supabase
    .from('generated_images')
    .insert({
      image_url: image.imageUrl,
      prompt: image.prompt,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save image: ${error.message}`)
  }

  return data
}

/**
 * Fetch all images from Supabase, ordered by most recent first
 */
export async function fetchImagesFromSupabase(): Promise<GeneratedImage[]> {
  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch images: ${error.message}`)
  }

  // Transform Supabase records to GeneratedImage format
  return data.map((record: ImageRecord) => ({
    id: record.id,
    imageUrl: record.image_url,
    prompt: record.prompt,
    timestamp: new Date(record.created_at),
  }))
}

/**
 * Fetch a single image by ID
 */
export async function fetchImageById(id: string): Promise<GeneratedImage | null> {
  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    throw new Error(`Failed to fetch image: ${error.message}`)
  }

  return {
    id: data.id,
    imageUrl: data.image_url,
    prompt: data.prompt,
    timestamp: new Date(data.created_at),
  }
}
