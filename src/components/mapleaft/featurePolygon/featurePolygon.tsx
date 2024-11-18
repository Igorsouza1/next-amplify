import { Polygon, Popup, Polyline } from 'react-leaflet'; // Importar Polyline
import { Feature } from '@/@types/geomtry';
import { convertGeoJSONToLeaflet } from '@/utils/geojson-utils';
import React from 'react';
import { useShapeContext } from '@/Context/shapeContext';

interface FeaturePolygonProps {
  feature: Feature;
  parentName: string;
  parentColor: string;
}

const FeaturePolygon = ({ feature, parentName, parentColor }: FeaturePolygonProps) => {
  const geometry = feature.geometry;
  const convertedCoordinates = convertGeoJSONToLeaflet(geometry);
  const { setSelectedFeature } = useShapeContext();

  if (!convertedCoordinates) return null;

  const popupContent = (
    <Popup>
      <div className="flex flex-col">
        <div>
          <strong>Nome:</strong> {parentName}
        </div>
      </div>
    </Popup>
  );

  if (geometry.type === 'Polygon') {
    return (
      <Polygon
        positions={convertedCoordinates}
        pathOptions={{ color: parentColor }}
        eventHandlers={{
          click: () => setSelectedFeature(feature.properties),
        }}
      >
        {popupContent}
      </Polygon>
    );
  }

  if (geometry.type === 'MultiPolygon') {
    return (
      <>
        {convertedCoordinates.map((coords, index) => (
          <Polygon
            key={index}
            positions={coords}
            pathOptions={{ color: parentColor }}
            eventHandlers={{
              click: () => setSelectedFeature(feature.properties),
            }}
          >
            {popupContent}
          </Polygon>
        ))}
      </>
    );
  }

  // Novo caso para MultiLineString
  if (geometry.type === 'MultiLineString') {
    return (
      <>
        {convertedCoordinates.map((coords, index) => (
          <Polyline
            key={index}
            positions={coords}
            pathOptions={{ color: parentColor }}
            eventHandlers={{
              click: () => setSelectedFeature(feature.properties),
            }}
          >
            {popupContent}
          </Polyline>
        ))}
      </>
    );
  }

  return null;
};

export default FeaturePolygon;
