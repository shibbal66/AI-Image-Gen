import { Card, CardContent } from '@/components/ui/card'

interface ImageCardProps {
  imageUrl: string
  prompt: string
  timestamp: Date
}

export default function ImageCard({ imageUrl, prompt, timestamp }: ImageCardProps) {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="group overflow-hidden hover:border-purple-500/50 transition-all duration-300">
      <div className="aspect-square relative overflow-hidden bg-gray-800">
        <img
          src={imageUrl}
          alt={prompt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-5 bg-white">
        <p className="text-sm text-gray-900 truncate mb-3 leading-relaxed font-medium" title={prompt}>
          Prompt: {prompt}
        </p>

  <div className="flex items-center justify-between">
    <span className="text-xs text-gray-600 font-semibold bg-gray-100 px-3 py-1.5 rounded-md">
      {formatTime(timestamp)}
    </span>
  </div>
</CardContent>
    </Card>
  )
}

