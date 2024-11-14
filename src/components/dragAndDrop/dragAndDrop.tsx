'use client'

import { useState, useCallback } from 'react'
import { FileText, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { GeometryData, Feature } from '@/@types/geomtry'
import useAdminCheck from '@/hooks/useAdminCheck'
import { createPost } from '@/app/_actions/actions'

const categories = ["Desmatamento", "Fogo", "Atividades", "Propriedades", "Outros"]

// Propriedades que queremos manter nas features
const filteredProperties = [
  "fonte", "municipio", "areaha", "datadetec", "vpressao", "cod_imovel", 
  "num_area", "DescSeg", "TipoPNV", "CODIGO", "OBJECTID", "codealerta"
]

export default function DragAndDrop() {
  const [geoJsonData, setGeoJsonData] = useState<GeometryData | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [name, setName] = useState("")
  const [color, setColor] = useState("#000000")
  const [category, setCategory] = useState(categories[0])
  const isAdmin = useAdminCheck()
  const [openFeatureIndexes, setOpenFeatureIndexes] = useState<{ [key: number]: boolean }>({})

  const handleToggleFeature = (index: number) => {
    setOpenFeatureIndexes((prev) => ({ ...prev, [index]: !prev[index] }))
  }

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
          setName(json.name)        // Define o estado inicial de `name`
          setColor(json.color)      // Define o estado inicial de `color`
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    if (geoJsonData) {
      setGeoJsonData({ ...geoJsonData, name: newName })
    }
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColor(newColor)
    if (geoJsonData) {
      setGeoJsonData({ ...geoJsonData, color: newColor })
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value)
  }

  // Função para enviar os dados para a ação createPost
  const handleSubmit = async () => {
    if (!geoJsonData) return;

    // Filtra as propriedades de cada feature
    const filteredFeatures = geoJsonData.features.map((feature) => ({
      ...feature,
      properties: Object.fromEntries(
        Object.entries(feature.properties).filter(([key]) => filteredProperties.includes(key))
      ),
    }));

    // Cria o FormData e adiciona os dados
    const formData = new FormData();
    formData.append('category', category);
    formData.append('type', geoJsonData.features[0]?.geometry.type || '');
    formData.append('name', name);
    formData.append('color', color);
    formData.append('features', JSON.stringify({ features: filteredFeatures })); // Envia `filteredFeatures` como JSON completo

    // Chama a ação createPost com o FormData
    await createPost(formData);
  };

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
                <div className="mb-2">
                  <label className="block font-medium">Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Color:</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={color}
                      onChange={handleColorChange}
                      className="w-10 h-10 p-0 border-none cursor-pointer"
                      style={{ backgroundColor: color }}
                    />
                    <span className="ml-2 text-sm">{color}</span>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Category:</label>
                  <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full p-1 border border-gray-300 rounded"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <p><span className="font-medium">Total Features:</span> {geoJsonData.features.length}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-md font-semibold">Features:</h4>
                {geoJsonData.features.map((feature: Feature, index: number) => (
                  <Collapsible key={index} open={openFeatureIndexes[index] || false} className="space-y-2">
                    <CollapsibleTrigger 
                      onClick={() => handleToggleFeature(index)}
                      className="flex items-center justify-between w-full p-2 text-sm font-medium text-left text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      <span>Feature {index + 1}</span>
                      {openFeatureIndexes[index] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pl-4 text-sm">
                      <p><strong>Type:</strong> {feature.type}</p>
                      <p><strong>Geometry Type:</strong> {feature.geometry.type}</p>
                      <div className="space-y-1">
                        <p className="font-semibold">Properties:</p>
                        <pre className="text-xs overflow-x-auto bg-gray-50 p-2 rounded">
                          {JSON.stringify(
                            Object.fromEntries(
                              Object.entries(feature.properties).filter(
                                ([key]) => filteredProperties.includes(key)
                              )
                            ),
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
              <button onClick={handleSubmit} className="mt-4 p-2 bg-blue-500 text-white rounded">
                Submit Data
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
