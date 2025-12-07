import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ImageGenerator from './components/ImageGenerator'
import RecentImages from './pages/RecentImages'
import Header from './components/Header'
import { Toaster } from './components/Toaster'

function App() {
  return (
    <Router>
     
        <Header />
        <Routes>
          <Route path="/" element={<ImageGenerator />} />
          <Route path="/recent" element={<RecentImages />} />
        </Routes>
        <Toaster />
      
    </Router>
  )
}

export default App
