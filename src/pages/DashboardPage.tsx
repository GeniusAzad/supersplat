import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Download, DollarSign, Eye, Upload } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { formatPrice, formatDate } from '../lib/utils'

// Mock data for demonstration
const mockUserSplats = [
  {
    id: '1',
    title: 'Vintage Car Collection',
    category: 'Vehicles',
    price: 29.99,
    download_count: 1247,
    created_at: '2024-01-15T10:00:00Z',
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }]
  },
  {
    id: '2',
    title: 'Modern Architecture',
    category: 'Architecture',
    price: 45.00,
    download_count: 892,
    created_at: '2024-01-10T10:00:00Z',
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }]
  },
  {
    id: '3',
    title: 'Forest Environment',
    category: 'Nature',
    price: 35.50,
    download_count: 2156,
    created_at: '2024-01-05T10:00:00Z',
    reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }]
  }
]

export function DashboardPage() {
  const { user } = useAuth()
  const isLoading = false
  const error = null
  const splats = mockUserSplats

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Please sign in to view your dashboard.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const totalEarnings = splats?.reduce((sum, splat) => sum + (splat.price * splat.download_count), 0) || 0
  const totalDownloads = splats?.reduce((sum, splat) => sum + splat.download_count, 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage your splats and track your performance
            </p>
          </div>
          <Link to="/sell">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload New Splat
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalEarnings)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{totalDownloads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Splats</p>
                <p className="text-2xl font-bold text-gray-900">{splats?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {splats?.length ? '4.8' : '0.0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Splats Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Splats</h2>
          </div>
          
          {error ? (
            <div className="p-6 text-center text-red-600">
              Error loading splats: {error.message}
            </div>
          ) : splats && splats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Splat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {splats.map((splat) => {
                    const averageRating = splat.reviews?.length 
                      ? splat.reviews.reduce((sum, review) => sum + review.rating, 0) / splat.reviews.length
                      : 0

                    return (
                      <tr key={splat.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-primary-600 font-bold text-xs">3D</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {splat.title}
                              </div>
                              {averageRating > 0 && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-yellow-600">★</span>
                                  <span className="text-xs text-gray-500">
                                    {averageRating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{splat.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {formatPrice(splat.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{splat.download_count}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-green-600">
                            {formatPrice(splat.price * splat.download_count)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">
                            {formatDate(splat.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/splat/${splat.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No splats yet</h3>
              <p className="text-gray-600 mb-4">
                Start by uploading your first 3D Gaussian Splat
              </p>
              <Link to="/sell">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Your First Splat
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}