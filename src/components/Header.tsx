import { Link, useLocation } from 'react-router-dom'
import { Home, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isRecent = location.pathname === '/recent'

  return (
    <header className=" w-full  border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <div className="`w-full  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 ">
          <Link to="/" className="flex items-center space-x-2 px-6!">
            <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Image Generator
            </h1>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4! py-2! mx-2!",
                isHome
                  ? "bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  : "hover:bg-gray-800 hover:text-white text-gray-400"
              )}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <Link
              to="/recent"
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4! py-2! mx-2!",
                isRecent
                  ? "bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  : "hover:bg-gray-800 hover:text-white text-gray-400"
              )}
            >
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Recent Images</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
