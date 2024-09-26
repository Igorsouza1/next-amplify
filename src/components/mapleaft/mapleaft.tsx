// components/MapLeaflet.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { getInitialGeometry } from "@/app/_actions/actions";
import FeaturePolygon from "./featurePolygon/featurePolygon";
import { GeometryData } from "@/@types/geomtry";

// Load MapContainer dynamically with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const MapLeaflet = () => {
  const [geometryData, setGeometryData] = useState<GeometryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInitialGeometry();
        console.log("MapLeaflet: Dados de geometria obtidos:", data);

        if (data) {
          const parsedData = data.map((item) => ({
            ...item,
            name: item.name ?? "",
            features:
              typeof item.features === "string"
                ? JSON.parse(item.features).features
                : item.features,
          }));

          setGeometryData(parsedData as GeometryData[]);
        }
      } catch (error) {
        console.error("Erro ao obter dados de geometria:", error);
      }
    };

    fetchData();
  }, []);

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
        if (!Array.isArray(item.features)) {
          console.error(`As features do item ${index} não são um array:`, item.features);
          return null;
        }

        return item.features.map((feature, featureIndex) => (
          <FeaturePolygon
            key={`${index}-${featureIndex}`}
            feature={feature}
            parentName={item.name}
            parentSize={item.size}
          />
        ));
      })}
    </MapContainer>
  );
};

export default MapLeaflet;
