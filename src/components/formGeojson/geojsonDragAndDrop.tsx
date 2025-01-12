'use client';

import { useState, useCallback } from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DragAndDrop() {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState<{ [key: number]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.geojson')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setGeoJsonData(json);
        } catch (error) {
          console.error('Erro ao ler o GeoJSON:', error);
          setGeoJsonData(null);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Por favor, insira um arquivo GeoJSON válido.');
    }
  }, []);

  const toggleFeature = (index: number) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSave = async () => {
    if (geoJsonData && fileName) {
      setIsSubmitting(true);
      alert('GeoJSON salvo com sucesso!');
      setIsSubmitting(false);
    } else {
      alert('Nenhum GeoJSON para salvar.');
    }
  };

  const renderGeoJsonDetails = () => {
    if (!geoJsonData) return null;

    return (
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Informações do GeoJSON:</h3>
        {fileName && (
          <div className="flex flex-row">
            <p className="font-bold pr-2">Nome do Arquivo:</p>
            <p>{fileName}</p>
          </div>
        )}
        <p>Tipo: {geoJsonData.type}</p>
        <p>Features: {geoJsonData.features ? geoJsonData.features.length : 'N/A'}</p>
        {geoJsonData.bbox && <p>Bounding Box: {JSON.stringify(geoJsonData.bbox)}</p>}

        {geoJsonData.features && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Features:</h4>
            {geoJsonData.features.map((feature: any, index: number) => (
              <div key={index} className="border p-2 mb-2 rounded-md bg-gray-50">
                <div
                  onClick={() => toggleFeature(index)}
                  className="cursor-pointer flex justify-between items-center"
                >
                  <p className="font-semibold">Feature {index + 1}</p>
                  <span>{expandedFeatures[index] ? '-' : '+'}</span>
                </div>
                {expandedFeatures[index] && (
                  <div className="mt-2">
                    <p>Tipo: {feature.type}</p>
                    {feature.geometry && (
                      <div>
                        <p>Tipo de Geometria: {feature.geometry.type}</p>
                        <p>Coordenadas: {JSON.stringify(feature.geometry.coordinates)}</p>
                      </div>
                    )}
                    {feature.properties && (
                      <div>
                        <p>Propriedades:</p>
                        <ul className="ml-4">
                          {Object.keys(feature.properties).map((key) => (
                            <li key={key}>
                              {key}: {JSON.stringify(feature.properties[key])}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar GeoJSON'}
        </Button>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Inserir GeoJSON</CardTitle>
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
            <p className="text-sm text-gray-500">Arraste e solte um arquivo GeoJSON aqui</p>
          </div>
          <div className="overflow-y-auto max-h-96 mt-4">
            {geoJsonData && renderGeoJsonDetails()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
