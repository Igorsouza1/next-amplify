'use client';

import { useState } from 'react';
import GeoJsonUploader from '@/components/dragAndDrop/utils/GeoJsonUploader';
import GeoJsonEditor from '@/components/dragAndDrop/utils/GeoJsonEditor';
import GeoJsonDetails from '@/components/dragAndDrop/utils/GeoJsonDetails';
import GeoJsonSender from '@/components/dragAndDrop/utils/GeoJsonSender';
import { GeometryData } from '@/@types/geomtry';

const filteredProperties = [
  'fonte', 'municipio', 'areaha', 'datadetec', 'vpressao', 'cod_imovel',
  'num_area', 'DescSeg', 'TipoPNV', 'CODIGO', 'OBJECTID', 'codealerta',
  'FONTE', 'MUNICIPIO', 'AREAHA', 'DATADETEC', 'VPRESSAO', 'COD_IMOVEL',
  'NUM_AREA', 'DESCSEG', 'TIPOPNV', 'CODIGO', 'OBJECTID', 'CODEALERTA',
  'NOME_PROP', 'nome', 'NOM_MUNICI', 'id', 'ID',
];

export default function DragAndDrop() {
  const [geoJsonData, setGeoJsonData] = useState<GeometryData | null>(null);
  const [isGeoJsonSent, setIsGeoJsonSent] = useState(false);

  const handleUploadSuccess = (data: GeometryData) => {
    setGeoJsonData(data);
    setIsGeoJsonSent(false);
  };

  const handleSaveChanges = (updatedGeoJson: GeometryData) => {
    setGeoJsonData(updatedGeoJson);
  };

  const handleSendSuccess = () => {
    setGeoJsonData(null);
    setIsGeoJsonSent(true);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-8">
      {!geoJsonData && !isGeoJsonSent && (
        <GeoJsonUploader onUploadSuccess={handleUploadSuccess} />
      )}
      {geoJsonData && (
        <>
          <GeoJsonEditor geoJsonData={geoJsonData} onSave={handleSaveChanges} />
          <GeoJsonDetails geoJsonData={geoJsonData} filteredProperties={filteredProperties} />
          <GeoJsonSender geoJsonData={geoJsonData} onSendSuccess={handleSendSuccess} />
        </>
      )}
      {isGeoJsonSent && (
        <div className="text-center text-green-700 font-semibold">
          GeoJSON has been sent successfully! You can upload another file.
        </div>
      )}
    </div>
  );
}
