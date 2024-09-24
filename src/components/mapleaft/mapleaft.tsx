"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { getInitialGeometry } from "@/app/_actions/actions";
import { convertPolygonStringToLatLngTuples } from "@/utils/geojson-utils";
import { LatLngTuple } from "leaflet";

// Carregar o componente MapContainer dinamicamente com `ssr: false`
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });

const MapLeaflet = () => {
  const [polygonCoordinates, setPolygonCoordinates] = useState<LatLngTuple[][][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obter os dados de geometria
        const geometryData = await getInitialGeometry();
        console.log("MapLeaflet: Dados de geometria obtidos:", geometryData);

        // Verificar se o array de geometria e a string de geometria possuem dados
        if (geometryData && geometryData.length > 0 && geometryData[0]?.geometry) {
          const geometryString = geometryData[0].geometry;
          console.log("MapLeaflet: String de geometria obtida:", geometryString);
          const coordinates = convertPolygonStringToLatLngTuples(geometryString as string);

          if (coordinates.length > 0) {
            setPolygonCoordinates(coordinates);
          } else {
            console.error("MapLeaflet: Coordenadas convertidas estão vazias.");
          }
        } else {
          console.error("MapLeaflet: String de geometria está vazia ou inválida.");
        }
      } catch (error) {
        console.error("MapLeaflet: Erro ao buscar dados de geometria:", error);
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
      {polygonCoordinates.map((polygon, index) => (
        <Polygon key={index} positions={polygon} color="blue" />
      ))}
    </MapContainer>
  );
};

export default MapLeaflet;
