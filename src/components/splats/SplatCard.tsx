import React from 'react'
import { Star, Download, Eye, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../lib/utils'
import { Button } from '../ui/Button'

interface SplatCardProps {
  id: string
  title: string
  description: string | null
  price: number
  thumbnail_url: string | null
  category: string
  seller: {
    username: string
    avatar_url: string | null
  }
  reviews: { rating: number }[]
  download_count: number
  is_featured?: boolean
}

export function SplatCard({
  id,
  title,
  description,
  price,
  thumbnail_url,
  category,
  seller,
  reviews,
  download_count,
  is_featured
}: SplatCardProps) {
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300 animate-fade-in">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">3D</span>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Link to={`/splat/${id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
        
        <div className="absolute top-2 left-2 flex space-x-2">
          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            {category}
          </span>
          {is_featured && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/splat/${id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {title}
            </h3>
          </Link>
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(price)}
          </span>
        </div>

        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>by {seller.username}</span>
          <div className="flex items-center space-x-3">
            {averageRating > 0 && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span>{averageRating.toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center">
              <Download className="w-4 h-4 mr-1" />
              <span>{download_count}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            Buy Now
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}