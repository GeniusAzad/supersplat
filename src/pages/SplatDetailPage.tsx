import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Download, Heart, Share2, User, Calendar } from 'lucide-react'
import { useSplat } from '../hooks/useSplats'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { formatPrice, formatDate } from '../lib/utils'

export function SplatDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: splat, isLoading, error } = useSplat(id!)
  const [downloading, setDownloading] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !splat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Splat Not Found</h1>
          <p className="text-gray-600 mb-4">The splat you're looking for doesn't exist.</p>
          <Link to="/browse">
            <Button>Browse Other Splats</Button>
          </Link>
        </div>
      </div>
    )
  }

  const averageRating = splat.reviews?.length 
    ? splat.reviews.reduce((sum, review) => sum + review.rating, 0) / splat.reviews.length
    : 0

  const handleDownload = async () => {
    if (!user) {
      // Show auth modal or redirect to login
      return
    }

    setDownloading(true)
    try {
      // In a real app, you'd handle the purchase/download logic here
      // For now, just simulate a download
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create download link
      const link = document.createElement('a')
      link.href = splat.file_url
      link.download = `${splat.title}.ply`
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Preview */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden mb-4">
              {splat.thumbnail_url ? (
                <img
                  src={splat.thumbnail_url}
                  alt={splat.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">3D</span>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery thumbnails would go here */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                  {splat.category}
                </span>
                {splat.is_featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {splat.title}
              </h1>

              {/* Rating */}
              {averageRating > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= averageRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({splat.reviews?.length} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="text-4xl font-bold text-primary-600 mb-6">
                {formatPrice(splat.price)}
              </div>

              {/* Description */}
              {splat.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {splat.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={handleDownload}
                  loading={downloading}
                  className="w-full"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  {user ? 'Download Now' : 'Sign In to Download'}
                </Button>
                
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Seller Info */}
              {splat.profiles && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Seller</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      {splat.profiles.avatar_url ? (
                        <img
                          src={splat.profiles.avatar_url}
                          alt={splat.profiles.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{splat.profiles.username}</p>
                      {splat.profiles.bio && (
                        <p className="text-sm text-gray-600">{splat.profiles.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="border-t pt-6 mt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Downloads:</span>
                    <span className="ml-2 font-medium">{splat.download_count}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Published:</span>
                    <span className="ml-2 font-medium">{formatDate(splat.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {splat.reviews && splat.reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Reviews</h2>
            <div className="space-y-6">
              {splat.reviews.map((review) => (
                <div key={review.id} className="card p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {review.profiles?.avatar_url ? (
                        <img
                          src={review.profiles.avatar_url}
                          alt={review.profiles.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {review.profiles?.username}
                        </span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}