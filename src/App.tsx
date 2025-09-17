import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { BrowsePage } from './pages/BrowsePage'
import { SplatDetailPage } from './pages/SplatDetailPage'
import { SellPage } from './pages/SellPage'
import { DashboardPage } from './pages/DashboardPage'
import { PLYViewerPage } from './pages/PLYViewerPage'
import { SimpleViewerPage } from './pages/SimpleViewerPage'

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Routes>
        <Route path="/simple-viewer" element={<SimpleViewerPage />} />
        <Route path="*" element={
          <>
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/splat/:id" element={<SplatDetailPage />} />
                <Route path="/sell" element={<SellPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/viewer" element={<PLYViewerPage />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>

    </div>
  )
}

export default App