import { useEffect } from 'react'
import ImageGrid from '../components/ImageGrid'
import { useRecentImagesStore } from '../store/recentImagesStore'
import { Loader2 } from 'lucide-react'

export default function RecentImages() {
  const { images, isLoading, error, fetchImages } = useRecentImagesStore()

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Recent Images
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Browse all your generated images
          </p>
        </header>

        {isLoading && (
          <div className="flex flex-col justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400 mb-4" />
            <p className="text-gray-400">Loading images...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col justify-center items-center py-12">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={() => fetchImages()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="max-w-7xl mx-auto">
            <ImageGrid images={images} />
          </div>
        )}
      </div>
    </div>
  )
}
