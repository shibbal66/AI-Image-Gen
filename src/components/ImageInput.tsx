import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageInputProps {
  onGenerate: (prompt: string) => void
  isLoading?: boolean
}

export default function ImageInput({ onGenerate, isLoading }: ImageInputProps) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim())
      setPrompt('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (prompt.trim() && !isLoading) {
        onGenerate(prompt.trim())
        setPrompt('')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want to create..."
            disabled={isLoading}
            rows={4}
            className={cn(
              'flex w-full rounded-xl border border-gray-700 bg-gray-900/50 px-6 py-4 text-sm text-white',
              'ring-offset-background placeholder:text-gray-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-0 focus-visible:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50 transition-all',
              'resize-none text-base leading-relaxed'
            )}
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="px-6 py-3"
            size="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

