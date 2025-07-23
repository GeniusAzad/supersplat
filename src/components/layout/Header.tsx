import React, { useState } from 'react'
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react'
import { Button } from '../ui/Button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                SplatMarket
              </h1>
            </div>
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
              <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Browse</a>
              <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Sell</a>
              <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">About</a>
            </nav>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              
              {isLoggedIn ? (
                <Button variant="ghost" size="sm">
                  <User className="w-5 h-5" />
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Sign In</Button>
                  <Button size="sm">Sign Up</Button>
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
              <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Browse</a>
              <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Sell</a>
              <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">About</a>
              <div className="pt-4 border-t border-gray-200">
                {isLoggedIn ? (
                  <Button variant="outline" className="w-full">
                    <User className="w-5 h-5 mr-2" />
                    Profile
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">Sign In</Button>
                    <Button className="w-full">Sign Up</Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}