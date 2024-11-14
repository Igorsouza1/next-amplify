'use client'

import { useState, useCallback } from 'react'
import { FileText, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { GeometryData, Feature } from '@/@types/geomtry'
import useAdminCheck from '@/hooks/useAdminCheck'

function FeatureItem({ feature }: { feature: Feature }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-left text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
        <span>Feature</span>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="pl-4 text-sm">
          <p><strong>Type:</strong> {feature.type}</p>
          <p><strong>Geometry Type:</strong> {feature.geometry.type}</p>
          <div>
            <p className="font-semibold">Properties:</p>
            <pre className="text-xs overflow-x-auto bg-gray-50 p-2 rounded">
              {JSON.stringify(feature.properties, null, 2)}
            </pre>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function DragAndDrop() {
  const [geoJsonData, setGeoJsonData] = useState<GeometryData | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const isAdmin = useAdminCheck()

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
          const json = JSON.parse(event.target?.result as string) as GeometryData
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

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Acesso negado. Você não tem permissão para acessar esta página.</p>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>GeoJSON Drag and Drop</CardTitle>
        </CardHeader>
        
        <CardContent className={geoJsonData ? 'max-h-96 overflow-y-scroll' : ''}>
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
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">GeoJSON Information:</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {geoJsonData.name}</p>
                <p><span className="font-medium">Color:</span> {geoJsonData.color}</p>
                <p><span className="font-medium">Total Features:</span> {geoJsonData.features.length}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-md font-semibold">Features:</h4>
                {geoJsonData.features.map((feature: Feature, index: number) => (
                  <FeatureItem key={index} feature={feature} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
