import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AudioPage from './pages/AudioPage'
import AIPage from './pages/AIPage'
import VideoPage from './pages/VideoPage'
import SpacePage from './pages/SpacePage'
import SettingsPage from './pages/SettingsPage'
import SubscriptionPage from './pages/SubscriptionPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-24">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/audio" element={<AudioPage />} />
            <Route path="/ai" element={<AIPage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/space" element={<SpacePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App