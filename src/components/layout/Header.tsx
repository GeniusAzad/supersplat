import React, { useState } from 'react'
import { Search, User, ShoppingCart, Menu, X, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { AuthModal } from '../auth/AuthModal'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin'
  })
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode })
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3D</span>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    SplatMarket
                  </h1>
                </div>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search 3D Gaussian Splats..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Navigation - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <nav className="flex space-x-6">
                <Link to="/browse" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Browse
                </Link>
                <Link to="/sell" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Sell
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  About
                </Link>
              </nav>
              
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
                
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Link to="/dashboard">
                      <Button variant="ghost" size="sm">
                        <User className="w-5 h-5" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openAuthModal('signin')}
                    >
                      Sign In
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => openAuthModal('signup')}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search splats..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <Link to="/browse" className="text-gray-700 hover:text-primary-600 font-medium">
                  Browse
                </Link>
                <Link to="/sell" className="text-gray-700 hover:text-primary-600 font-medium">
                  Sell
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium">
                  About
                </Link>
                <div className="pt-4 border-t border-gray-200">
                  {user ? (
                    <div className="space-y-2">
                      <Link to="/dashboard">
                        <Button variant="outline" className="w-full">
                          <User className="w-5 h-5 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full" onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => openAuthModal('signin')}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="w-full"
                        onClick={() => openAuthModal('signup')}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        mode={authModal.mode}
        onModeChange={(mode) => setAuthModal({ ...authModal, mode })}
      />
    </>
  )
}