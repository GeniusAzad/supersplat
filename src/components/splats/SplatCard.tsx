import React from 'react'
import { Star, Download, Eye } from 'lucide-react'
import { formatPrice } from '../../lib/utils'
import { Button } from '../ui/Button'

interface SplatCardProps {
  id: string
  title: string
  description: string
  price: number
  thumbnail: string
  rating: number
  downloads: number
  seller: string
  category: string
}

export function SplatCard({
  title,
  description,
  price,
  thumbnail,
  rating,
  downloads,
  seller,
  category
}: SplatCardProps) {
  return (
    <div className="card group hover:shadow-lg transition-all duration-300 animate-fade-in">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(price)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>by {seller}</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Download className="w-4 h-4 mr-1" />
              <span>{downloads}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            Add to Cart
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}