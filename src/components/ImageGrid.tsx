import ImageCard from './ImageCard'

export interface GeneratedImage {
  id: string
  imageUrl: string
  prompt: string
  timestamp: Date
}

interface ImageGridProps {
  images: GeneratedImage[]
}

export default function ImageGrid({ images }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center text-center py-8">
        <div className="inline-block p-4 bg-gray-900/50 rounded-full mb-4">
          <svg
            className="w-12 h-12 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-gray-400 text-lg">No images generated yet</p>
        <p className="text-gray-500 text-sm mt-2">Start creating by entering a prompt above</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          imageUrl={image.imageUrl}
          prompt={image.prompt}
          timestamp={image.timestamp}
        />
      ))}
    </div>
  )
}

