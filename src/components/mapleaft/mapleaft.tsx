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
          {/* OpenStreetMap Layer */}
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          {/* Topographic Map */}
          <BaseLayer name="Topográfico">
            <TileLayer
              attribution="Map data: &copy; OpenTopoMap contributors"
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          {/* Satellite Map */}
          <BaseLayer name="Satélite (Google)">
            <TileLayer
              attribution="Imagery © Google"
              url="https://www.google.com/maps/vt?lyrs=s&x={x}&y={y}&z={z}" // Utilize uma API Key válida para produção
            />
          </BaseLayer>

          {/* Render active shapes */}
          {activeShapes.map((shape) =>
  shape.features.map((feature) => (
    <FeaturePolygon
      key={feature.geometry.coordinates.toString()}
      feature={feature} // Passa a Feature completa
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
      />

    </>
  );
};

export default MapLeaflet;
