'use client';

/**
 * Componente MapLeaflet
 * 
 * Este componente renderiza um mapa interativo utilizando a biblioteca react-leaflet e Leaflet.
 * Permite adicionar camadas de mapa, renderizar polígonos e pontos, e exibir informações dinâmicas.
 * 
 * Funcionalidades:
 * - Alternar entre diferentes camadas de mapa (OpenStreetMap, Topográfico, Satélite).
 * - Renderizar shapes (polígonos) e pontos com informações do contexto.
 * - Personalizar ícones de marcadores.
 * - Mostrar uma barra lateral com detalhes do elemento selecionado.
 * 
 * Dependências:
 * - react-leaflet: Biblioteca React para integração com Leaflet.
 * - leaflet: Biblioteca base para manipulação de mapas.
 * 
 * Observação:
 * O componente utiliza carregamento dinâmico (`dynamic`) para evitar problemas de SSR no Next.js.
 */


import dynamic from 'next/dynamic';
import { TileLayer, LayersControl, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Importa o Leaflet para criar ícones personalizados
import 'leaflet/dist/leaflet.css';
import FeaturePolygon from './featurePolygon/featurePolygon';
import RightSideBar from '@/components/RighSidbar/rightSidebar';
import { useShapeContext } from '@/Context/shapeContext';
import { GeometryData, Feature } from "@/@types/geomtry";



const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const { BaseLayer } = LayersControl;



interface Point {
  latitude: number;
  longitude: number;
  name: string;
  description?: string; 
  time?: string;        
  acao?: string;        
}

interface Shape {
  features: Feature[];  
  name: string;         
  color: string;        
}

interface ShapeContext {
  activeShapes: GeometryData[];           
  activePoints: any[];            
  selectedFeature: Feature | null;   
  setSelectedFeature: React.Dispatch<React.SetStateAction<Feature | null>>;
}




// Criando o ícone personalizado para os marcadores
// TODO: Criar um ícone personalizado para os pontos
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


          {/* TIPOS DE MAPAS */}
          {/* OpenStreetMap Layer */}
          <BaseLayer checked name="Satélite (Google)">
          <TileLayer
              attribution="Imagery © Google"
              url="https://www.google.com/maps/vt?lyrs=s&x={x}&y={y}&z={z}"
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
          <BaseLayer name="OpenStreetMap">
          <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
