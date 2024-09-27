"use client";

import dynamic from "next/dynamic";
import { TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import FeaturePolygon from "./featurePolygon/featurePolygon";
import { useFetchGeometryData } from "@/hooks/useFetchGeometryData"; // Importando o hook personalizado

// Load MapContainer dynamically with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const MapLeaflet = () => {
  // Usando o hook personalizado para obter os dados
  const geometryData = useFetchGeometryData();

  return (
    <MapContainer
      center={[-21.327773, -56.694734]}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geometryData.map((item, index) => {
        if (Array.isArray(item.features)) {
          return item.features.map((feature, featureIndex) => (
            <FeaturePolygon
              key={`${index}-${featureIndex}`}
              feature={feature}
              parentName={item.name}
              parentSize={item.size}
              parentColor={item.color}
            />
          ));
        } else {
          console.error(`As features do item ${index} não são um array:`, item.features);
          return null; // Retorna null se item.features não for um array
        }
      })}
    </MapContainer>
  );
};

export default MapLeaflet;
