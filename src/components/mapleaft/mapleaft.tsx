"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { getInitialGeometry } from "@/app/_actions/actions";
import { convertGeoJSONToLeaflet } from "@/utils/geojson-utils";

// Load MapContainer dynamically with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

type Coordinate = [number, number];
type LinearRing = Coordinate[];
type Polygon = LinearRing[];
type MultiPolygon = Polygon[];

type Geometry = {
  type: String;
  coordinates: Coordinate | Coordinate[] | Polygon | MultiPolygon;
};

type GeometryData = {
  name: string;
  geometry: Geometry;
};

const MapLeaflet = () => {
  const [polygonCoordinates, setPolygonCoordinates] = useState<GeometryData[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const geometryData = await getInitialGeometry();
        console.log("MapLeaflet: Dados de geometria obtidos:", geometryData);

        if (geometryData) {
          setPolygonCoordinates(geometryData as GeometryData[]);
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

      {/* Renderizando múltiplos polígonos */}
      {polygonCoordinates.map((item, index) => {
    // Verifica se item.geometry é uma string e, em caso afirmativo, converte para objeto
    let geometry;
    try {
        geometry = typeof item.geometry === "string" ? JSON.parse(item.geometry).geometry : item.geometry;
    } catch (error) {
        console.error("Erro ao analisar a geometria do item:", item, error);
        return null;
    }

    // Adicione verificações extras
    if (!geometry || !geometry.type) {
        console.error("A geometria ou o tipo de geometria está ausente para o item:", item);
        return null; // Pular itens com geometria inválida
    }

    console.log("Geometry", geometry);
    console.log("Geometry Type", geometry.type);

    const convertedCoordinates = convertGeoJSONToLeaflet(geometry);

    if (convertedCoordinates) {
        if (geometry.type === "Polygon") {
            return (
                <Polygon key={index} positions={convertedCoordinates} pathOptions={{ color: 'purple' }}>
                    <Popup>
                        <div>
                            <strong>Nome:</strong> {item.name}
                        </div>
                    </Popup>
                </Polygon>
            );
        } else if (geometry.type === "MultiPolygon") {
            return convertedCoordinates.map((coords, polyIndex) => (
                <Polygon key={`${index}-${polyIndex}`} positions={coords} pathOptions={{ color: 'purple' }}>
                    <Popup>
                        <div>
                            <strong>Nome:</strong> {item.name}
                        </div>
                    </Popup>
                </Polygon>
            ));
        }
    }
    return null;
})}
    </MapContainer>
  );
};

export default MapLeaflet;
