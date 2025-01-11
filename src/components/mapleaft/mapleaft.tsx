'use client';

import dynamic from 'next/dynamic';
import { TileLayer, LayersControl, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Importa o Leaflet para criar ícones personalizados
import 'leaflet/dist/leaflet.css';
import FeaturePolygon from './featurePolygon/featurePolygon';
import RightSideBar from '@/components/RighSidbar/rightSidebar';
import { useShapeContext } from '@/Context/shapeContext';

// Caminho para a imagem do marcador
import markerIcon from '@/assets/marker-icon.png';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const { BaseLayer } = LayersControl;

// Criando o ícone personalizado
const customIcon = L.icon({
  iconUrl: '/target.png', // Caminho relativo ao diretório public
  iconSize: [41, 41], // Dimensão do ícone (ajuste conforme necessário)
  iconAnchor: [12, 41], // Ponto de ancoragem do ícone
  popupAnchor: [1, -34], // Posição do popup em relação ao ícone
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // Sombra opcional
  shadowSize: [41, 41],
});

const MapLeaflet = () => {
  const { activeShapes, selectedFeature, setSelectedFeature, activePoints } = useShapeContext();

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

          {/* Render active points */}
          {activePoints.map((point) => (
            <Marker
              key={`${point.latitude}-${point.longitude}`} // Identificador único para cada ponto
              position={[point.latitude, point.longitude]} // Coordenadas do marcador
              icon={customIcon} // Aplicando o ícone personalizado
            >
              <Popup>
                <div>
                  <strong>Nome:</strong> {point.name} <br />
                  <strong>Descrição:</strong> {point.description} <br />
                  <strong>Horário:</strong> {point.time} <br />
                  <strong>Ação:</strong> {point.acao}
                </div>
              </Popup>
            </Marker>
          ))}
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
