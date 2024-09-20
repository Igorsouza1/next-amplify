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
  const [polygonCoordinates, setPolygonCoordinates] = useState<LatLngTuple[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obter os dados de geometria
        const geometryData = await getInitialGeometry();

        // Verificar se o array de geometria possui dados
        if (geometryData.length > 0) {
          const geometryString = geometryData[0]?.geometry;

          // Verificar se a string de geometria está presente
          if (geometryString) {
            const coordinates = convertPolygonStringToLatLngTuples(geometryString as string);

            if (coordinates.length > 0) {
              setPolygonCoordinates(coordinates);
            } else {
              console.error("MapLeaflet: Coordenadas convertidas estão vazias.");
            }
          } else {
            console.error("MapLeaflet: String de geometria está vazia ou inválida.");
          }
        } else {
          console.error("MapLeaflet: Nenhuma geometria disponível.");
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
      <Polygon  positions={polygonCoordinates} color="blue" />
    </MapContainer>
  );
};

export default MapLeaflet;
