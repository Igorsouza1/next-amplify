'use client';

import { useState, useCallback } from 'react';
import { FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GeometryData } from '@/@types/geomtry';
import { isValidGeometryData } from '@/utils/geojson-utils';

interface GeoJsonUploaderProps {
  onUploadSuccess: (data: GeometryData) => void;
}

export default function GeoJsonUploader({ onUploadSuccess }: GeoJsonUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
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
              setSuccessMessage('GeoJSON file loaded successfully!');
              onUploadSuccess(json);
            } else {
              throw new Error('Invalid GeoJSON structure');
            }
          } catch (error) {
            console.error('Error parsing GeoJSON:', error);
            setErrorMessage('Invalid GeoJSON file. Please check the file and try again.');
          }
        };
        reader.readAsText(file);
      } else {
        setErrorMessage('Please drop a valid GeoJSON file (.geojson)');
      }
    },
    [onUploadSuccess]
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Upload GeoJSON File</CardTitle>
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
        </CardContent>
      </Card>
    </div>
  );
}
