import React, { useState } from 'react'
import { ArrowLeft, Info, Download, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { PLYSequenceViewer } from '../components/viewer/PLYSequenceViewer'

export function PLYViewerPage() {
  const [viewerSettings, setViewerSettings] = useState({
    fps: 30,
    autoPlay: true,
    loop: true,
    showInfo: true
  })

  // Configuration for the salmon sequence
  const sequenceConfig = {
    baseUrl: 'https://pub-79fbb62129314af79420e1ccb1a1c3f8.r2.dev/frames',
    totalFrames: 150,
    name: 'Salmon Sequence',
    description: 'High-quality 3D Gaussian Splat sequence showing detailed salmon movement and behavior'
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  const handleDownloadAll = () => {
    alert('Bulk download feature coming soon!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{sequenceConfig.name}</h1>
                <p className="text-gray-600">{sequenceConfig.totalFrames} frame sequence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadAll}>
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <PLYSequenceViewer
                baseUrl={sequenceConfig.baseUrl}
                totalFrames={sequenceConfig.totalFrames}
                className="aspect-video w-full"
                autoPlay={viewerSettings.autoPlay}
                loop={viewerSettings.loop}
                fps={viewerSettings.fps}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sequence Info */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-primary-600" />
                Sequence Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Frames:</span>
                  <span className="font-medium">{sequenceConfig.totalFrames}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frame Rate:</span>
                  <span className="font-medium">{viewerSettings.fps} FPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {(sequenceConfig.totalFrames / viewerSettings.fps).toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">Compressed PLY</span>
                </div>
              </div>

              {viewerSettings.showInfo && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {sequenceConfig.description}
                  </p>
                </div>
              )}
            </div>

            {/* Playback Settings */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Playback Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frame Rate
                  </label>
                  <select 
                    value={viewerSettings.fps}
                    onChange={(e) => setViewerSettings(prev => ({ ...prev, fps: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={15}>15 FPS</option>
                    <option value={24}>24 FPS</option>
                    <option value={30}>30 FPS</option>
                    <option value={60}>60 FPS</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Auto Play</label>
                  <input
                    type="checkbox"
                    checked={viewerSettings.autoPlay}
                    onChange={(e) => setViewerSettings(prev => ({ ...prev, autoPlay: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Loop</label>
                  <input
                    type="checkbox"
                    checked={viewerSettings.loop}
                    onChange={(e) => setViewerSettings(prev => ({ ...prev, loop: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show Info</label>
                  <input
                    type="checkbox"
                    checked={viewerSettings.showInfo}
                    onChange={(e) => setViewerSettings(prev => ({ ...prev, showInfo: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Info</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">File Format:</span>
                  <span className="font-medium">PLY (Compressed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compression:</span>
                  <span className="font-medium">Gaussian Splat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Source:</span>
                  <span className="font-medium">4DV.ai</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quality:</span>
                  <span className="font-medium">High</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Current Frame
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Viewer Link
                </Button>
                <Link to="/browse" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Browse More Splats
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}