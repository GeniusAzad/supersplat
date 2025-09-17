import React from 'react'
import { ArrowRight, Star, TrendingUp, Users, Zap, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { SplatGrid } from '../components/splats/SplatGrid'
import { PLYViewer } from '../components/viewer/PLYViewer'

export function HomePage() {
  const stats = [
    { icon: Users, label: 'Active Creators', value: '10K+' },
    { icon: Star, label: 'Quality Splats', value: '50K+' },
    { icon: TrendingUp, label: 'Downloads', value: '1M+' },
    { icon: Zap, label: 'New This Week', value: '500+' },
  ]

  const featuredCategories = [
    { name: 'Architecture', count: 1250, image: 'https://picsum.photos/300/200?random=10' },
    { name: 'Vehicles', count: 890, image: 'https://picsum.photos/300/200?random=11' },
    { name: 'Nature', count: 2100, image: 'https://picsum.photos/300/200?random=12' },
    { name: 'Characters', count: 650, image: 'https://picsum.photos/300/200?random=13' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                The World's Premier
                <span className="block text-yellow-300">3D Gaussian Splats</span>
                Marketplace
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-slide-up">
                Discover, buy, and sell high-quality 3D Gaussian splats from talented creators worldwide. 
                Perfect for games, VR, AR, and digital experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up">
                <Link to="/browse">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                    Start Browsing
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/viewer">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                    Try PLY Viewer
                  </Button>
                </Link>
                <Link to="/sell">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                    Become a Seller
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - 3D PLY Viewer */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <PLYViewer className="h-96 lg:h-[500px] w-full" autoRotate={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect 3D Gaussian splats for your project across various categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category, index) => (
              <Link
                key={category.name}
                to={`/browse?category=${category.name.toLowerCase()}`}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.count} splats</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Splats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Splats</h2>
              <p className="text-gray-600">Hand-picked premium content from our top creators</p>
            </div>
            <Link to="/browse">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <SplatGrid splats={[]} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of creators earning from their 3D Gaussian splats. 
            Upload your first splat today and start building your portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sell">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <Upload className="w-5 h-5 mr-2" />
                Start Selling Today
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}