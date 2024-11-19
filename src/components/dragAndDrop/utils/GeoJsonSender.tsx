'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GeometryData } from '@/@types/geomtry';

interface GeoJsonSenderProps {
  geoJsonData: GeometryData;
  onSendSuccess: () => void;
}

const filteredProperties = [
  'fonte', 'municipio', 'areaha', 'datadetec', 'vpressao', 'cod_imovel',
  'num_area', 'DescSeg', 'TipoPNV', 'CODIGO', 'OBJECTID', 'codealerta',
  'FONTE', 'MUNICIPIO', 'AREAHA', 'DATADETEC', 'VPRESSAO', 'COD_IMOVEL',
  'NUM_AREA', 'DESCSEG', 'TIPOPNV', 'CODIGO', 'OBJECTID', 'CODEALERTA',
  'NOME_PROP', 'nome', 'NOM_MUNICI', 'id', 'ID',
];

export default function GeoJsonSender({ geoJsonData, onSendSuccess }: GeoJsonSenderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSend = async () => {
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
      formData.append('name', geoJsonData.name || 'Unnamed GeoJSON');
      formData.append('color', geoJsonData.color || '#000000');
      formData.append('category', geoJsonData.category || 'Uncategorized');
      formData.append('features', JSON.stringify({ features: filteredFeatures }));

      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simula uma espera de 2 segundos

      setSuccessMessage('GeoJSON sent successfully!');
      onSendSuccess();
    } catch (error) {
      console.error('Error sending GeoJSON:', error);
      setErrorMessage('Failed to send GeoJSON. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h3 className="text-lg font-semibold">Send GeoJSON</h3>
      <Button
        onClick={handleSend}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-r-2 border-gray-500 rounded-full" />
            Sending...
          </>
        ) : (
          'Send GeoJSON'
        )}
      </Button>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      {successMessage && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
