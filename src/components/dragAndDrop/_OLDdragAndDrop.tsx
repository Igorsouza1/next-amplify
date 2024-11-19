'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Importa a biblioteca UUID
import { FileText, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GeometryData, Feature } from '@/@types/geomtry';
import useAdminCheck from '@/hooks/useAdminCheck';
import { createPost } from '@/app/_actions/actions';
import { isValidGeometryData } from '@/utils/geojson-utils';

const categories = ['Desmatamento', 'Fogo', 'Atividades', 'Propriedades', 'Outros'];

// Propriedades que queremos manter nas features
const filteredProperties = [
  'fonte', 'municipio', 'areaha', 'datadetec', 'vpressao', 'cod_imovel',
  'num_area', 'DescSeg', 'TipoPNV', 'CODIGO', 'OBJECTID', 'codealerta',
  'FONTE', 'MUNICIPIO', 'AREAHA', 'DATADETEC', 'VPRESSAO', 'COD_IMOVEL',
  'NUM_AREA', 'DESCSEG', 'TIPOPNV', 'CODIGO', 'OBJECTID', 'CODEALERTA',
  'NOME_PROP', 'nome', 'NOM_MUNICI', 'id', 'ID',
];



export default function DragAndDrop() {
  const [geoJsonData, setGeoJsonData] = useState<GeometryData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [category, setCategory] = useState(categories[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAdmin = useAdminCheck();
  const [openFeatureIndexes, setOpenFeatureIndexes] = useState<{ [key: number]: boolean }>({});


  
  const reducePrecision = (coordinates: any, precision: number): any => {
    if (Array.isArray(coordinates[0])) {
      return coordinates.map((coord) => reducePrecision(coord, precision));
    }
    return coordinates.map((val: number) => parseFloat(val.toFixed(precision)));
  };
  

  const handleToggleFeature = (index: number) => {
    setOpenFeatureIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMessage(null);
    setSuccessMessage(null);

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.geojson')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string) as GeometryData;

          if (isValidGeometryData(json)) {
            // Adicionar IDs únicos a cada feature
            const featuresWithIds = json.features.map((feature) => ({
              ...feature,
              id: feature.id || uuidv4(), // Gera um ID único para cada feature
              geometry: {
                ...feature.geometry,
                coordinates: reducePrecision(feature.geometry.coordinates, 5), // Reduz para 5 casas decimais
              },
            }));

            const updatedGeoJsonData = {
              ...json,
              features: featuresWithIds,
            };

            setGeoJsonData(updatedGeoJsonData);
            setName(json.name);
            setErrorMessage(null);
            setSuccessMessage('GeoJSON loaded successfully!');
          } else if ((json as GeometryData).crs?.properties?.name !== 'urn:ogc:def:crs:EPSG::4674') {
            setErrorMessage('Invalid CRS. Only EPSG:4674 is supported.');
          } else {
            throw new Error('Invalid GeoJSON structure');
          }
        } catch (error) {
          console.error('Error parsing GeoJSON:', error);
          setGeoJsonData(null);
          setErrorMessage('Invalid GeoJSON file. Please check the file and try again.');
        }
      };
      reader.readAsText(file);
    } else {
      setErrorMessage('Please drop a valid GeoJSON file (.geojson)');
    }
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (geoJsonData) {
      setGeoJsonData({ ...geoJsonData, name: newName });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    if (geoJsonData) {
      setGeoJsonData({ ...geoJsonData, color: newColor });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async () => {
    if (!geoJsonData) {
      setErrorMessage('No GeoJSON data to send. Please upload a file first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const filteredFeatures = geoJsonData.features.map((feature) => ({
        ...feature,
        properties: Object.fromEntries(
          Object.entries(feature.properties).filter(([key]) => filteredProperties.includes(key))
        ),
      }));

      const formData = new FormData();
      formData.append('category', category);
      formData.append('type', geoJsonData.features[0]?.geometry.type || '');
      formData.append('name', name);
      formData.append('color', color);
      formData.append('features', JSON.stringify({ features: filteredFeatures }));

      await createPost(formData);
      setSuccessMessage('GeoJSON sent successfully!');
    } catch (error) {
      console.error('Error sending GeoJSON:', error);
      setErrorMessage('Failed to send GeoJSON. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Access denied. You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto h-screen overflow-y-scroll">
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
            <p className="text-sm text-gray-500">Drag and drop a GeoJSON file here</p>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default" className="mt-4 bg-green-50 border-green-200 text-green-800">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

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
                  <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="w-10 h-10 border-none cursor-pointer"
                  />
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
                <p>
                  <span className="font-medium">Total Features:</span> {geoJsonData.features.length}
                </p>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-scroll border border-gray-200 rounded-md p-2">
                <h4 className="text-md font-semibold">Features:</h4>
                {geoJsonData.features.map((feature: Feature, index: number) => (
  <Collapsible
    key={index}
    open={openFeatureIndexes[index] || false}
    className="space-y-2"
  >
    <CollapsibleTrigger
      onClick={() => handleToggleFeature(index)}
      className="flex items-center justify-between w-full p-2 text-sm font-medium text-left text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
    >
      <span>Feature {index + 1}</span>
      {openFeatureIndexes[index] ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </CollapsibleTrigger>
    <CollapsibleContent className="space-y-2 pl-4 text-sm">
      <p>
        <strong>ID:</strong> {feature.id || 'N/A'} {/* Exibe o ID da feature */}
      </p>
      <p>
        <strong>Type:</strong> {feature.type}
      </p>
      <p>
        <strong>Geometry Type:</strong> {feature.geometry.type}
      </p>
      <div className="space-y-1">
        <p className="font-semibold">Properties:</p>
        <pre className="text-xs overflow-x-auto bg-gray-50 p-2 rounded">
          {JSON.stringify(
            Object.fromEntries(
              Object.entries(feature.properties).filter(([key]) =>
                filteredProperties.includes(key)
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
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send GeoJSON'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
