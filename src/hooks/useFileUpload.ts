import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { generateThumbnail } from '../lib/utils'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadFile = async (file: File, path: string) => {
    setUploading(true)
    setProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const { data, error } = await supabase.storage
        .from('splats')
        .upload(path, file)

      clearInterval(progressInterval)
      setProgress(100)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('splats')
        .getPublicUrl(path)

      return publicUrl
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const uploadThumbnail = async (file: File, splatId: string) => {
    const thumbnailDataUrl = await generateThumbnail(file)
    
    // Convert data URL to blob
    const response = await fetch(thumbnailDataUrl)
    const blob = await response.blob()
    
    const thumbnailPath = `thumbnails/${splatId}.jpg`
    return await uploadFile(blob as File, thumbnailPath)
  }

  return {
    uploadFile,
    uploadThumbnail,
    uploading,
    progress,
  }
}