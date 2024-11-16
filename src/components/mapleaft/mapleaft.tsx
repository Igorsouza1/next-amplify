'use client';

import dynamic from 'next/dynamic';
import { TileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import FeaturePolygon from './featurePolygon/featurePolygon';
import RightSideBar from '@/components/RighSidbar/rightSidebar';
import { useShapeContext } from '@/Context/shapeContext';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const { BaseLayer } = LayersControl;

const MapLeaflet = () => {
  const { activeShapes, selectedFeature, setSelectedFeature } = useShapeContext();

  return (
    <>
      <MapContainer center={[-21.327773, -56.694734]} zoom={10} style={{ height: '100vh', width: '100%' }}>
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          {activeShapes.map((shape) =>
            shape.features.map((feature) => (
              <FeaturePolygon
                feature={feature}
                parentName={shape.name}
                parentColor={shape.color}
              />
            ))
          )}
        </LayersControl>
      </MapContainer>

      <RightSideBar
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        properties={selectedFeature || {}}
      />
    </>
  );
};

export default MapLeaflet;
