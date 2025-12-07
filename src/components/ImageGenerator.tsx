import { useState, useEffect } from 'react'
import ImageInput from './ImageInput'
import { useImageGeneration } from '../hooks/useImageGeneration'
import { useImageStore, selectImages } from '../store/imageStore'
import type { GeneratedImage } from './ImageGrid'
import { Loader2 } from 'lucide-react'

export default function ImageGenerator() {
  const { generate, isLoading } = useImageGeneration()
  const images = useImageStore(selectImages)
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)

  // Update current image when images array changes
  useEffect(() => {
    if (images.length > 0) {
      setCurrentImage(images[0])
    }
  }, [images])

  const handleGenerate = async (prompt: string) => {
    await generate(prompt)
  }

  const hasCurrentImage = currentImage !== null

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950">
      <div  className={`w-full mx-auto px-4 sm:px-6 lg:px-8 
    flex flex-col items-center
    ${hasCurrentImage ? 'py-8 sm:py-12' : 'justify-center min-h-screen'}
  `}>
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Image Generator
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Transform your ideas into stunning visuals
          </p>
        </header>

        {/* Input field - centered when no image, justify-center when image exists */}
        <div className="w-full flex justify-center items-center mb-8 sm:mb-12">
          <ImageInput onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        {/* Loading Effect */}
        {isLoading && (
          <div className="w-full flex justify-center mb-8 sm:mb-12">
            <div className="max-w-4xl w-full bg-gray-900/50 rounded-lg p-4 sm:p-6 border border-gray-800">
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
                  <span className="text-purple-400">Generating</span>{' '}
                  <span className="text-white">Image...</span>
                </h2>
                <p className="text-gray-400 text-sm text-center">
                  This may take a few moments
                </p>
                {/* Skeleton loader for image */}
                <div className="mt-8 w-full max-w-md">
                  <div className="aspect-square bg-gray-800 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display generated image below input - centered */}
        {hasCurrentImage && !isLoading && (
          <div className="w-full flex justify-center mb-8 sm:mb-12">
            <div className="max-w-4xl w-full bg-gray-900/50 rounded-lg p-4 sm:p-6 border border-gray-800">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
                <span className="text-purple-400">Generated</span>{' '}
                <span className="text-white">Image</span>
              </h2>
              <div className="flex justify-center">
                <img
                  src={currentImage.imageUrl}
                  alt={currentImage.prompt}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <p className="text-gray-400 text-sm mt-4 text-center">
                Prompt: {currentImage.prompt}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
