"use client";

import dynamic from "next/dynamic";
import { TileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import FeaturePolygon from "./featurePolygon/featurePolygon";
import { useShapeContext } from "@/Context/shapeContext";

// Carregamento dinâmico do MapContainer para SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const { BaseLayer } = LayersControl;

const MapLeaflet = () => {
  const { activeShapes } = useShapeContext();

  return (
    <MapContainer
      center={[-21.327773, -56.694734]}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      <LayersControl position="topright">
        {/* Camadas de Tile com diferentes fontes */}
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        <BaseLayer name="Esri World Imagery">
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>

        <BaseLayer name="Topo">
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        {/* Renderização dos polígonos ativos no contexto */}
        {activeShapes.map((shape) =>
          shape.features.map((feature) => (
            <FeaturePolygon
              key={feature.id}
              feature={feature}
              parentName={shape.name} // Nome para identificar o conjunto de features
            />
          ))
        )}
      </LayersControl>
    </MapContainer>
  );
};

export default MapLeaflet;
