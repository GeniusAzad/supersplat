import React, { useRef, useEffect } from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface PLYViewerProps {
  className?: string
  autoRotate?: boolean
}

export function PLYViewer({ className = '', autoRotate = true }: PLYViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  useEffect(() => {
    let animationId: number

    const initViewer = async () => {
      try {
        if (!containerRef.current) return

        // Create a simple 3D visualization using CSS transforms
        // This simulates a PLY viewer without requiring heavy 3D libraries
        const viewer = document.createElement('div')
        viewer.className = 'ply-viewer-content'
        viewer.innerHTML = `
          <div class="splat-cloud">
            ${Array.from({ length: 200 }, (_, i) => {
              const x = (Math.random() - 0.5) * 300
              const y = (Math.random() - 0.5) * 300
              const z = (Math.random() - 0.5) * 300
              const size = Math.random() * 4 + 1
              const opacity = Math.random() * 0.8 + 0.2
              const hue = Math.random() * 360
              
              return `<div class="splat-point" style="
                transform: translate3d(${x}px, ${y}px, ${z}px);
                width: ${size}px;
                height: ${size}px;
                background: hsla(${hue}, 70%, 60%, ${opacity});
                border-radius: 50%;
                position: absolute;
                box-shadow: 0 0 ${size * 2}px hsla(${hue}, 70%, 60%, ${opacity * 0.5});
              "></div>`
            }).join('')}
          </div>
        `

        // Add CSS for the viewer
        const style = document.createElement('style')
        style.textContent = `
          .ply-viewer-content {
            width: 100%;
            height: 100%;
            perspective: 1000px;
            overflow: hidden;
            position: relative;
            background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
            border-radius: 12px;
          }
          
          .splat-cloud {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            animation: ${autoRotate ? 'rotate3d 20s linear infinite' : 'none'};
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .splat-point {
            transition: all 0.3s ease;
          }
          
          .ply-viewer-content:hover .splat-point {
            transform: scale(1.2);
          }
          
          @keyframes rotate3d {
            0% { transform: rotateY(0deg) rotateX(10deg); }
            100% { transform: rotateY(360deg) rotateX(10deg); }
          }
          
          .ply-viewer-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
            pointer-events: none;
            z-index: 1;
          }
        `
        
        if (!document.head.querySelector('#ply-viewer-styles')) {
          style.id = 'ply-viewer-styles'
          document.head.appendChild(style)
        }

        containerRef.current.appendChild(viewer)
        
        // Simulate loading time
        setTimeout(() => {
          setLoading(false)
        }, 1500)

      } catch (err) {
        setError('Failed to load PLY viewer')
        setLoading(false)
      }
    }

    initViewer()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [autoRotate])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <p className="text-red-600 font-medium">Failed to load 3D viewer</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-white text-sm">Loading 3D Gaussian Splat...</p>
          </div>
        </div>
      )}
      
      <div ref={containerRef} className="w-full h-full" />
      
      {!loading && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live 3D Preview</span>
          </div>
        </div>
      )}
      
      {!loading && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-xs">
          Sample: Vintage Car Collection
        </div>
      )}
    </div>
  )
}