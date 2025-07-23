import React from 'react'
import { SplatCard } from './SplatCard'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface Splat {
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

interface SplatGridProps {
  splats: Splat[]
  loading?: boolean
}

// Mock data for preview
const mockSplats: Splat[] = [
  {
    id: '1',
    title: 'Vintage Car Collection',
    description: 'High-quality 3D Gaussian splat of classic vintage automobiles with incredible detail and realistic lighting.',
    price: 29.99,
    thumbnail: 'https://picsum.photos/400/300?random=1',
    rating: 4.8,
    downloads: 1247,
    seller: 'AutoSplats3D',
    category: 'Vehicles'
  },
  {
    id: '2',
    title: 'Modern Architecture',
    description: 'Contemporary building facade captured with photogrammetry and converted to Gaussian splats.',
    price: 45.00,
    thumbnail: 'https://picsum.photos/400/300?random=2',
    rating: 4.9,
    downloads: 892,
    seller: 'ArchViz Pro',
    category: 'Architecture'
  },
  {
    id: '3',
    title: 'Forest Environment',
    description: 'Immersive forest scene with detailed trees, foliage, and natural lighting effects.',
    price: 35.50,
    thumbnail: 'https://picsum.photos/400/300?random=3',
    rating: 4.7,
    downloads: 2156,
    seller: 'NatureScans',
    category: 'Nature'
  },
  {
    id: '4',
    title: 'Character Portrait',
    description: 'Realistic human face capture with fine details and natural expressions.',
    price: 55.00,
    thumbnail: 'https://picsum.photos/400/300?random=4',
    rating: 4.9,
    downloads: 743,
    seller: 'PortraitMaster',
    category: 'Characters'
  },
  {
    id: '5',
    title: 'Industrial Equipment',
    description: 'Detailed machinery and industrial equipment perfect for technical visualizations.',
    price: 40.00,
    thumbnail: 'https://picsum.photos/400/300?random=5',
    rating: 4.6,
    downloads: 567,
    seller: 'TechSplats',
    category: 'Industrial'
  },
  {
    id: '6',
    title: 'Food & Cuisine',
    description: 'Appetizing food items captured in stunning detail for culinary applications.',
    price: 25.00,
    thumbnail: 'https://picsum.photos/400/300?random=6',
    rating: 4.8,
    downloads: 1089,
    seller: 'FoodieViz',
    category: 'Food'
  }
]

export function SplatGrid({ splats = mockSplats, loading = false }: SplatGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (splats.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No splats found</div>
        <p className="text-gray-400">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {splats.map((splat) => (
        <SplatCard key={splat.id} {...splat} />
      ))}
    </div>
  )
}