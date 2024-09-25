"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { getInitialGeometry } from "@/app/_actions/actions";

// Load MapContainer dynamically with SSR disabled
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });

type GeometryData = {
  name: string;
  geometry: {
    type: string;
    coordinates: any;
  };
};


const MapLeaflet = (geometryData: GeometryData[]) => {
  const [polygonCoordinates, setPolygonCoordinates] = useState<GeometryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const geometryData = await getInitialGeometry();
        console.log("MapLeaflet: Dados de geometria obtidos:", geometryData);
        setPolygonCoordinates(geometryData as GeometryData[]);
      } catch (error) {
        console.error("Erro ao obter dados de geometria:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <MapContainer center={[-21.327773, -56.694734]} zoom={10} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
    </MapContainer>
  );
};

export default MapLeaflet;
