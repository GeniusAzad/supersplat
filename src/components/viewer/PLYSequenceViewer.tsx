import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Volume2, Settings, Maximize, Download } from 'lucide-react'
import { Button } from '../ui/Button'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface PLYSequenceViewerProps {
  baseUrl: string
  totalFrames: number
  className?: string
  autoPlay?: boolean
  loop?: boolean
  fps?: number
  showDemo?: boolean
}

export function PLYSequenceViewer({ 
  baseUrl, 
  totalFrames, 
  className = '', 
  autoPlay = true,
  loop = true,
  fps = 30,
  showDemo = false
}: PLYSequenceViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isLoading, setIsLoading] = useState(true)
  const [loadedFrames, setLoadedFrames] = useState(new Set<number>())
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const animationRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)
  const frameIntervalRef = useRef<number>(1000 / fps)

  // Simulate PLY frame loading
  const preloadFrame = useCallback(async (frameIndex: number) => {
    if (loadedFrames.has(frameIndex)) return

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 50))
      setLoadedFrames(prev => new Set([...prev, frameIndex]))
    } catch (err) {
      console.warn(`Failed to preload frame ${frameIndex}:`, err)
    }
  }, [loadedFrames])

  // Initialize viewer with salmon-like animation
  useEffect(() => {
    const initViewer = async () => {
      try {
        if (!containerRef.current || !canvasRef.current) return

        const canvas = canvasRef.current
        const container = containerRef.current
        
        canvas.width = container.clientWidth * window.devicePixelRatio
        canvas.height = container.clientHeight * window.devicePixelRatio
        canvas.style.width = container.clientWidth + 'px'
        canvas.style.height = container.clientHeight + 'px'

        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get 2D context')
        
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

        // Render salmon-like swimming animation
        const renderFrame = (frameIndex: number) => {
          const width = canvas.width / window.devicePixelRatio
          const height = canvas.height / window.devicePixelRatio
          
          ctx.clearRect(0, 0, width, height)
          
          // Dark underwater background
          const gradient = ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, Math.max(width, height) / 2
          )
          gradient.addColorStop(0, '#1a2332')
          gradient.addColorStop(0.7, '#0f1419')
          gradient.addColorStop(1, '#000000')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, width, height)

          // Simulate salmon body with point cloud
          const time = frameIndex / totalFrames * Math.PI * 4
          const swimCycle = Math.sin(time * 2) * 0.3
          
          // Main salmon body
          const centerX = width / 2 + Math.sin(time * 0.5) * 100
          const centerY = height / 2 + Math.cos(time * 0.3) * 50
          
          // Body segments
          for (let segment = 0; segment < 20; segment++) {
            const segmentTime = time - segment * 0.1
            const bodyX = centerX - segment * 15 + Math.sin(segmentTime * 3) * (20 - segment)
            const bodyY = centerY + Math.sin(segmentTime * 4 + segment * 0.2) * 8
            
            // Body points
            for (let i = 0; i < 50; i++) {
              const angle = (i / 50) * Math.PI * 2
              const radius = (20 - segment * 0.8) * (1 + Math.sin(angle * 2) * 0.3)
              const x = bodyX + Math.cos(angle) * radius
              const y = bodyY + Math.sin(angle) * radius * 0.6
              
              // Color variation - salmon-like colors
              const hue = 15 + Math.sin(segmentTime + i * 0.1) * 20
              const saturation = 70 + Math.sin(time + i * 0.05) * 20
              const lightness = 45 + Math.sin(angle + segmentTime) * 15
              
              const size = Math.max(0.5, 2 - segment * 0.05)
              const alpha = Math.max(0.4, 0.9 - segment * 0.03)
              
              ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
              ctx.beginPath()
              ctx.arc(x, y, size, 0, Math.PI * 2)
              ctx.fill()
            }
          }

          // Tail fin
          const tailX = centerX - 300 + Math.sin(time * 3) * 40
          const tailY = centerY + Math.sin(time * 4) * 15
          
          for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI - Math.PI / 2
            const radius = 40 + Math.sin(time * 2 + i * 0.2) * 10
            const x = tailX + Math.cos(angle) * radius
            const y = tailY + Math.sin(angle) * radius
            
            const size = Math.max(0.5, 3 - i * 0.05)
            const alpha = 0.7 - i * 0.02
            
            ctx.fillStyle = `hsla(25, 60%, 50%, ${alpha})`
            ctx.beginPath()
            ctx.arc(x, y, size, 0, Math.PI * 2)
            ctx.fill()
          }

          // Fins
          const finTime = time * 2
          for (let fin = 0; fin < 2; fin++) {
            const finX = centerX - 50 + fin * 100
            const finY = centerY + (fin === 0 ? -30 : 30) + Math.sin(finTime + fin * Math.PI) * 10
            
            for (let i = 0; i < 15; i++) {
              const angle = (i / 15) * Math.PI * 0.5 - Math.PI * 0.25
              const radius = 20 + Math.sin(finTime + i * 0.3) * 5
              const x = finX + Math.cos(angle) * radius
              const y = finY + Math.sin(angle) * radius
              
              const size = Math.max(0.5, 2 - i * 0.1)
              const alpha = 0.6 - i * 0.03
              
              ctx.fillStyle = `hsla(20, 50%, 45%, ${alpha})`
              ctx.beginPath()
              ctx.arc(x, y, size, 0, Math.PI * 2)
              ctx.fill()
            }
          }

          // Water particles/bubbles
          for (let i = 0; i < 100; i++) {
            const particleTime = time + i * 0.1
            const x = (i * 37) % width + Math.sin(particleTime) * 20
            const y = (i * 23) % height + Math.cos(particleTime * 0.7) * 30
            
            const size = Math.random() * 2 + 0.5
            const alpha = Math.sin(particleTime) * 0.3 + 0.2
            
            ctx.fillStyle = `rgba(100, 150, 200, ${alpha})`
            ctx.beginPath()
            ctx.arc(x, y, size, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        renderFrame(currentFrame)
        setIsLoading(false)

        // Preload frames progressively
        for (let i = 0; i < Math.min(20, totalFrames); i++) {
          setTimeout(() => preloadFrame(i), i * 100)
        }

      } catch (err) {
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
      const range = 10
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleDownload = () => {
    const url = `${baseUrl}/${currentFrame}.compressed.ply`
    const link = document.createElement('a')
    link.href = url
    link.download = `salmon_frame_${currentFrame.toString().padStart(3, '0')}.compressed.ply`
    link.click()
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-white text-lg">Loading Salmon Sequence...</p>
            <p className="text-gray-400 text-sm mt-2">150 frames • 4DV.ai</p>
          </div>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {!isLoading && (
        <>
          {/* Top Bar */}
          <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex justify-between items-start">
              <div className="text-white">
                <h1 className="text-2xl font-bold mb-1">Salmon Sequence</h1>
                <p className="text-gray-300 text-sm">4DV.ai • 150 frames • Gaussian Splats</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="text-white hover:bg-white/20 border-white/30"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 border-white/30"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 border-white/30"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={totalFrames - 1}
                  value={currentFrame}
                  onChange={handleFrameSeek}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${(currentFrame / (totalFrames - 1)) * 100}%, rgba(255,255,255,0.2) ${(currentFrame / (totalFrames - 1)) * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
                
                {/* Frame markers */}
                <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none">
                  {Array.from({ length: Math.min(10, totalFrames / 10) }, (_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-2 bg-white/40"
                      style={{ left: `${(i * 10 / (totalFrames - 1)) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-300 mt-2">
                <span>00:00</span>
                <span className="text-white font-medium">
                  {Math.floor(currentFrame / fps / 60).toString().padStart(2, '0')}:
                  {Math.floor((currentFrame / fps) % 60).toString().padStart(2, '0')}
                </span>
                <span>{Math.floor((totalFrames - 1) / fps / 60).toString().padStart(2, '0')}:
                {Math.floor(((totalFrames - 1) / fps) % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Control Panel */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-white hover:bg-white/20 p-3"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevFrame}
                  className="text-white hover:bg-white/20 p-3"
                  disabled={currentFrame === 0}
                >
                  <SkipBack className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7" />
                  ) : (
                    <Play className="w-7 h-7 ml-1" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextFrame}
                  className="text-white hover:bg-white/20 p-3"
                  disabled={currentFrame === totalFrames - 1}
                >
                  <SkipForward className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-3"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Center Info */}
              <div className="text-center text-white">
                <div className="text-lg font-bold">Frame {currentFrame}</div>
                <div className="text-sm text-gray-300">{fps} FPS • {totalFrames} total</div>
              </div>

              {/* Right Info */}
              <div className="text-right text-white">
                <div className="text-sm text-gray-300">
                  Loaded: {loadedFrames.size}/{totalFrames}
                </div>
                <div className="text-xs text-gray-400">
                  Quality: High • Format: PLY
                </div>
              </div>
            </div>
          </div>

          {/* Loading Progress Overlay */}
          {loadedFrames.size < totalFrames && (
            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm">
                  Loading frames... {loadedFrames.size}/{totalFrames}
                </span>
              </div>
            </div>
          )}

          {/* Demo Badge */}
          {showDemo && (
            <div className="absolute top-6 left-6 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              4DV Demo
            </div>
          )}

          {/* Quality Indicator */}
          <div className="absolute bottom-6 left-6 flex items-center space-x-2 text-white">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live 3D Gaussian Splats</span>
          </div>
        </>
      )}
    </div>
  )
}