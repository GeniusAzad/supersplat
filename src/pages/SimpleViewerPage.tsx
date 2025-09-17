import React from 'react'
import { PLYSequenceViewer } from '../components/viewer/PLYSequenceViewer'

export function SimpleViewerPage() {
  // Configuration for the salmon sequence
  const sequenceConfig = {
    baseUrl: 'https://pub-79fbb62129314af79420e1ccb1a1c3f8.r2.dev/frames',
    totalFrames: 150,
  }

  return (
    <div className="w-screen h-screen bg-black">
      <PLYSequenceViewer
        baseUrl={sequenceConfig.baseUrl}
        totalFrames={sequenceConfig.totalFrames}
        className="w-full h-full"
        autoPlay={true}
        loop={true}
        fps={30}
      />
    </div>
  )
}