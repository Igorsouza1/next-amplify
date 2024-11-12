'use client'

import { useState, useCallback } from 'react'
import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DragAndDrop() {
  const [geoJsonData, setGeoJsonData] = useState<any>(null)
  const [isDragging, setIsDragging] = useState(false)
  

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.geojson')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string)
          setGeoJsonData(json)
        } catch (error) {
          console.error('Error parsing GeoJSON:', error)
          setGeoJsonData(null)
        }
      }
      reader.readAsText(file)
    } else {
      alert('Please drop a valid GeoJSON file')
    }
  }, [])

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>GeoJSON Drag and Drop</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-sm text-gray-500">
              Drag and drop a GeoJSON file here
            </p>
          </div>
          {geoJsonData && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">GeoJSON Information:</h3>
              <p>Type: {geoJsonData.type}</p>
              <p>
                Features:{' '}
                {geoJsonData.features ? geoJsonData.features.length : 'N/A'}
              </p>
              {geoJsonData.bbox && (
                <p>Bounding Box: {JSON.stringify(geoJsonData.bbox)}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}