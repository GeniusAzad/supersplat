import React from 'react'
import { SplatCard } from './SplatCard'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface SplatGridProps {
  splats: any[]
  loading?: boolean
  error?: Error | null
}

// Mock data for demonstration
const mockSplats = [
  {
    id: '1',
    title: 'Vintage Car Collection',
    description: 'High-quality 3D Gaussian splat of classic vintage automobiles with incredible detail and realistic lighting.',
    price: 29.99,
    thumbnail_url: 'https://picsum.photos/400/300?random=1',
    category: 'Vehicles',
    seller: { username: 'AutoSplats3D', avatar_url: null },
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
    download_count: 1247,
    is_featured: true
  },
  {
    id: '2',
    title: 'Modern Architecture',
    description: 'Contemporary building facade captured with photogrammetry and converted to Gaussian splats.',
    price: 45.00,
    thumbnail_url: 'https://picsum.photos/400/300?random=2',
    category: 'Architecture',
    seller: { username: 'ArchViz Pro', avatar_url: null },
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
    download_count: 892,
    is_featured: false
  },
  {
    id: '3',
    title: 'Forest Environment',
    description: 'Immersive forest scene with detailed trees, foliage, and natural lighting effects.',
    price: 35.50,
    thumbnail_url: 'https://picsum.photos/400/300?random=3',
    category: 'Nature',
    seller: { username: 'NatureScans', avatar_url: null },
    reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }],
    download_count: 2156,
    is_featured: true
  },
  {
    id: '4',
    title: 'Character Portrait',
    description: 'Realistic human face capture with fine details and natural expressions.',
    price: 55.00,
    thumbnail_url: 'https://picsum.photos/400/300?random=4',
    category: 'Characters',
    seller: { username: 'PortraitMaster', avatar_url: null },
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }],
    download_count: 743,
    is_featured: false
  },
  {
    id: '5',
    title: 'Industrial Equipment',
    description: 'Detailed machinery and industrial equipment perfect for technical visualizations.',
    price: 40.00,
    thumbnail_url: 'https://picsum.photos/400/300?random=5',
    category: 'Industrial',
    seller: { username: 'TechSplats', avatar_url: null },
    reviews: [{ rating: 4 }, { rating: 4 }, { rating: 5 }],
    download_count: 567,
    is_featured: false
  },
  {
    id: '6',
    title: 'Food & Cuisine',
    description: 'Appetizing food items captured in stunning detail for culinary applications.',
    price: 25.00,
    thumbnail_url: 'https://picsum.photos/400/300?random=6',
    category: 'Food',
    seller: { username: 'FoodieViz', avatar_url: null },
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
    download_count: 1089,
    is_featured: true
  }
]

export function SplatGrid({ splats = mockSplats, loading = false, error }: SplatGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">Error loading splats</div>
        <p className="text-gray-400">{error.message}</p>
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