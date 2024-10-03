"use client";

import dynamic from "next/dynamic";
import { TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import FeaturePolygon from "./featurePolygon/featurePolygon";

import { useShapeContext } from "@/Context/shapeContext";

// Load MapContainer dynamically with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);


const MapLeaflet = () => {
  const { activeShapes } = useShapeContext();

  return (
    <MapContainer
      center={[-21.327773, -56.694734]}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {activeShapes.map((shape) =>
        shape.features.map((feature) => (
          <FeaturePolygon
            key={feature.id}
            feature={feature}
            parentName={shape.name}
            parentSize={shape.size}
            parentColor={shape.color}
          />
        ))
      )}
    </MapContainer>
  );
};

export default MapLeaflet;
