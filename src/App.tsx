import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { BrowsePage } from './pages/BrowsePage'
import { SplatDetailPage } from './pages/SplatDetailPage'
import { SellPage } from './pages/SellPage'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/splat/:id" element={<SplatDetailPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App