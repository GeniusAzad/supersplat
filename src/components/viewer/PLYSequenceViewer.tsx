import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Download, Settings } from 'lucide-react'
import { Button } from '../ui/Button'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface PLYSequenceViewerProps {
  baseUrl: string
  totalFrames: number
  className?: string
  autoPlay?: boolean
  loop?: boolean
  fps?: number
}

export function PLYSequenceViewer({ 
  baseUrl, 
  totalFrames, 
  className = '', 
  autoPlay = false,
  loop = true,
  fps = 30 
}: PLYSequenceViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isLoading, setIsLoading] = useState(true)
  const [loadedFrames, setLoadedFrames] = useState(new Set<number>())
  const [error, setError] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(true)
  const animationRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)
  const frameIntervalRef = useRef<number>(1000 / fps)

  // Preload frames
  const preloadFrame = useCallback(async (frameIndex: number) => {
    if (loadedFrames.has(frameIndex)) return

    try {
      const url = `${baseUrl}/${frameIndex}.compressed.ply`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to load frame ${frameIndex}`)
      
      // Store the frame data (in a real implementation, you'd parse and render the PLY)
      setLoadedFrames(prev => new Set([...prev, frameIndex]))
    } catch (err) {
      console.warn(`Failed to preload frame ${frameIndex}:`, err)
    }
  }, [baseUrl, loadedFrames])

  // Initialize viewer
  useEffect(() => {
    const initViewer = async () => {
      try {
        if (!containerRef.current || !canvasRef.current) return

        const canvas = canvasRef.current
        const container = containerRef.current
        
        // Set canvas size
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight

        // Create a simple 3D point cloud visualization
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get 2D context')

        // Simulate PLY point cloud rendering
        const renderFrame = (frameIndex: number) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          // Create gradient background
          const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          )
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)')
          gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Simulate point cloud with animation based on frame
          const numPoints = 1000
          const time = frameIndex / totalFrames * Math.PI * 2
          
          for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2 + time
            const radius = 100 + Math.sin(angle * 3 + time) * 50
            const x = canvas.width / 2 + Math.cos(angle) * radius
            const y = canvas.height / 2 + Math.sin(angle) * radius * 0.6
            const z = Math.sin(angle * 2 + time) * 50
            
            // Color based on position and frame
            const hue = (angle * 180 / Math.PI + frameIndex * 2) % 360
            const saturation = 70 + Math.sin(time + i * 0.1) * 20
            const lightness = 50 + z * 0.5
            
            const size = Math.max(1, 3 + z * 0.05)
            const alpha = Math.max(0.3, 0.8 + z * 0.01)
            
            ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
            ctx.beginPath()
            ctx.arc(x, y, size, 0, Math.PI * 2)
            ctx.fill()
            
            // Add glow effect
            ctx.shadowColor = ctx.fillStyle
            ctx.shadowBlur = size * 2
            ctx.beginPath()
            ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
            ctx.fill()
            ctx.shadowBlur = 0
          }

          // Add frame indicator
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.font = '14px monospace'
          ctx.fillText(`Frame: ${frameIndex}/${totalFrames - 1}`, 20, 30)
          
          // Add loading indicator for current frame
          if (!loadedFrames.has(frameIndex)) {
            ctx.fillStyle = 'rgba(255, 165, 0, 0.8)'
            ctx.fillText('Loading...', 20, 50)
          }
        }

        renderFrame(currentFrame)
        setIsLoading(false)

        // Preload initial frames
        for (let i = 0; i < Math.min(10, totalFrames); i++) {
          preloadFrame(i)
        }

      } catch (err) {
        setError('Failed to initialize PLY sequence viewer')
        setIsLoading(false)
      }
    }

    initViewer()
  }, [currentFrame, totalFrames, loadedFrames, preloadFrame])

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return

    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTimeRef.current >= frameIntervalRef.current) {
        setCurrentFrame(prev => {
          const next = prev + 1
          if (next >= totalFrames) {
            return loop ? 0 : prev
          }
          return next
        })
        lastFrameTimeRef.current = timestamp
      }
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, totalFrames, loop])

  // Preload nearby frames
  useEffect(() => {
    const preloadNearby = async () => {
      const range = 5
      for (let i = Math.max(0, currentFrame - range); i <= Math.min(totalFrames - 1, currentFrame + range); i++) {
        if (!loadedFrames.has(i)) {
          await preloadFrame(i)
        }
      }
    }
    preloadNearby()
  }, [currentFrame, totalFrames, preloadFrame, loadedFrames])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevFrame = () => {
    setCurrentFrame(prev => Math.max(0, prev - 1))
    setIsPlaying(false)
  }

  const handleNextFrame = () => {
    setCurrentFrame(prev => Math.min(totalFrames - 1, prev + 1))
    setIsPlaying(false)
  }

  const handleReset = () => {
    setCurrentFrame(0)
    setIsPlaying(false)
  }

  const handleFrameSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frame = parseInt(e.target.value)
    setCurrentFrame(frame)
    setIsPlaying(false)
  }

  const handleDownload = () => {
    const url = `${baseUrl}/${currentFrame}.compressed.ply`
    const link = document.createElement('a')
    link.href = url
    link.download = `frame_${currentFrame.toString().padStart(3, '0')}.compressed.ply`
    link.click()
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-white text-sm">Loading PLY Sequence...</p>
          </div>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      />
      
      {!isLoading && showControls && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300">
          {/* Top Info Bar */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>PLY Sequence: {totalFrames} frames</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4">
              {/* Timeline Slider */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={totalFrames - 1}
                  value={currentFrame}
                  onChange={handleFrameSeek}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f60 0%, #f60 ${(currentFrame / (totalFrames - 1)) * 100}%, #666 ${(currentFrame / (totalFrames - 1)) * 100}%, #666 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>0</span>
                  <span className="text-white font-medium">
                    {currentFrame} / {totalFrames - 1}
                  </span>
                  <span>{totalFrames - 1}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevFrame}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  disabled={currentFrame === 0}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white hover:bg-opacity-20 w-12 h-12"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextFrame}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  disabled={currentFrame === totalFrames - 1}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                <div className="text-white text-sm ml-4">
                  {fps} FPS
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Progress */}
      {isLoading && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Loading frames...</span>
              <span className="text-sm">{loadedFrames.size}/{Math.min(10, totalFrames)}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(loadedFrames.size / Math.min(10, totalFrames)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}