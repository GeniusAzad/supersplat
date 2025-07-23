import React, { useState } from 'react'
import { Upload, Image, DollarSign, Tag, FileText, Eye, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

const splatSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be at least $0.01'),
  category: z.string().min(1, 'Please select a category'),
  tags: z.string().min(1, 'Please add at least one tag'),
})

type SplatFormData = z.infer<typeof splatSchema>

export function SellPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SplatFormData>({
    resolver: zodResolver(splatSchema)
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.name.endsWith('.ply') || file.name.endsWith('.splat')
    )
    
    if (validFiles.length > 0) {
      setUploadedFiles(validFiles)
      simulateUpload()
    } else {
      alert('Please upload .ply or .splat files only')
    }
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const onSubmit = async (data: SplatFormData) => {
    if (uploadedFiles.length === 0) {
      alert('Please upload a splat file first')
      return
    }

    console.log('Form data:', data)
    console.log('Uploaded files:', uploadedFiles)
    
    // In real app, this would create the splat listing
    alert('Splat listing created successfully!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sell Your 3D Gaussian Splats</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your creativity with the world and earn from your 3D content. 
            Upload high-quality Gaussian splats and reach thousands of buyers.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Upload Section */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Upload className="w-6 h-6 mr-3 text-primary-600" />
                  Upload Your Splat
                </h2>

                {/* File Upload Area */}
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
                    ${dragActive 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {isUploading ? (
                    <div className="space-y-4">
                      <LoadingSpinner size="lg" className="mx-auto" />
                      <div className="text-lg font-medium text-gray-900">Uploading...</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-600">{uploadProgress}% complete</div>
                    </div>
                  ) : uploadedFiles.length > 0 ? (
                    <div className="space-y-4">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                      <div className="text-lg font-medium text-gray-900">
                        Files uploaded successfully!
                      </div>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-100 rounded px-3 py-2">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setUploadedFiles([])
                          setUploadProgress(0)
                        }}
                      >
                        Upload Different Files
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <div className="text-lg font-medium text-gray-900 mb-2">
                          Drop your .ply or .splat files here
                        </div>
                        <div className="text-gray-600 mb-4">
                          or click to browse your files
                        </div>
                        <input
                          type="file"
                          multiple
                          accept=".ply,.splat"
                          onChange={handleFileInput}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button type="button" as="span">
                            Choose Files
                          </Button>
                        </label>
                      </div>
                      <div className="text-sm text-gray-500">
                        Supported formats: .ply, .splat (Max 100MB per file)
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Guidelines */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Upload Guidelines</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ensure high quality and detail in your splats</li>
                    <li>• Include proper lighting and realistic materials</li>
                    <li>• Optimize file size while maintaining quality</li>
                    <li>• Test your splats before uploading</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Details Form */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-primary-600" />
                  Splat Details
                </h2>

                <div className="space-y-6">
                  <Input
                    label="Title"
                    {...register('title')}
                    error={errors.title?.message}
                    placeholder="Enter a descriptive title for your splat"
                  />

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px] resize-none"
                      placeholder="Describe your 3D Gaussian splat, its features, and potential uses..."
                      rows={4}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Price (USD)
                      </label>
                      <input
                        type="number"
                        {...register('price', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="29.99"
                        min="0"
                        step="0.01"
                      />
                      {errors.price && (
                        <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                        <Tag className="w-4 h-4 mr-1" />
                        Category
                      </label>
                      <select 
                        {...register('category')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        <option value="architecture">Architecture</option>
                        <option value="vehicles">Vehicles</option>
                        <option value="nature">Nature</option>
                        <option value="characters">Characters</option>
                        <option value="industrial">Industrial</option>
                        <option value="food">Food</option>
                        <option value="abstract">Abstract</option>
                        <option value="furniture">Furniture</option>
                      </select>
                      {errors.category && (
                        <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                      )}
                    </div>
                  </div>

                  <Input
                    label="Tags"
                    {...register('tags')}
                    error={errors.tags?.message}
                    placeholder="car, vintage, automobile, 3d, realistic (comma separated)"
                  />

                  {/* Thumbnail Upload */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                      <Image className="w-4 h-4 mr-1" />
                      Thumbnail Image (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                      <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Upload a preview image</div>
                      <Button variant="outline" size="sm" className="mt-2" type="button">
                        Choose Image
                      </Button>
                    </div>
                  </div>

                  {/* License */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      License Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="standard">Standard License</option>
                      <option value="extended">Extended License</option>
                      <option value="exclusive">Exclusive License</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6">
                    <Button type="button" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Listing
                    </Button>
                    <Button type="button" variant="outline" className="flex-1">
                      Save Draft
                    </Button>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Publish Splat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Seller Benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn 70% Revenue</h3>
            <p className="text-gray-600">Keep the majority of your sales with our creator-friendly revenue split</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Exposure</h3>
            <p className="text-gray-600">Reach customers worldwide through our marketplace platform</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Upload</h3>
            <p className="text-gray-600">Simple drag-and-drop interface with automated processing</p>
          </div>
        </div>
      </div>
    </div>
  )
}