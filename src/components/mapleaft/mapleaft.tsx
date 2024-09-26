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
type PolygonType = LinearRing[];
type MultiPolygon = PolygonType[];

type Geometry = {
  type: string;
  coordinates: PolygonType | MultiPolygon;
};

type Feature = {
  type: "Feature";
  properties: {
    cod_tema?: string; // Código do tema
    nom_tema?: string; // Nome do tema
    cod_imovel?: string; // Código do imóvel
    mod_fiscal?: number; // Modalidade fiscal
    num_area?: number; // Número da área
    ind_status?: string; // Indicador de status
    ind_tipo?: string; // Indicador de tipo
    des_condic?: string; // Descrição da condição
    municipio?: string; // Nome do município
    cod_estado?: string; // Código do estado
  };
  geometry: Geometry;
};

type GeometryData = {
  name: string;
  size: string;
  features: Feature[]; // Lista de Features
};

const MapLeaflet = () => {
  const [geometryData, setGeometryData] = useState<GeometryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInitialGeometry();
        console.log("MapLeaflet: Dados de geometria obtidos:", data);

        if (data) {
          // Verifica e transforma features de string para objeto
          const parsedData = data.map((item) => ({
            ...item,
            name: item.name ?? '',
            features: typeof item.features === "string" ? JSON.parse(item.features).features : item.features
          }));

          setGeometryData(parsedData as GeometryData[]);
        }
      } catch (error) {
        console.error("Erro ao obter dados de geometria:", error);
      }
    };

    fetchData();
  }, []);

  function gerarCorAleatoria() {
    const letras = "0123456789ABCDEF";
    let cor = "#";
    for (let i = 0; i < 6; i++) {
      cor += letras[Math.floor(Math.random() * 16)];
    }
    return cor;
  }

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

      {/* Renderizando múltiplos features contidos em GeometryData */}
      {geometryData.map((item, index) => {
        // Verifica se item.features é um array
        if (Array.isArray(item.features)) {
          return item.features.map((feature, featureIndex) => {
            // Verifica se feature.geometry é uma string e, em caso afirmativo, converte para objeto
            let geometry;
            try {
              geometry =
                typeof feature.geometry === "string"
                  ? JSON.parse(feature.geometry).geometry
                  : feature.geometry;
            } catch (error) {
              console.error(
                "Erro ao analisar a geometria do feature:",
                feature,
                error
              );
              return null;
            }

            // Verifica se geometry é válido e possui um tipo
            if (!geometry || !geometry.type) {
              console.error(
                "A geometria ou o tipo de geometria está ausente para o feature:",
                feature
              );
              return null; // Pular features com geometria inválida
            }

            console.log("Feature Geometry", geometry);
            console.log("Feature Geometry Type", geometry.type);

            const convertedCoordinates = convertGeoJSONToLeaflet(geometry);

            if (convertedCoordinates) {
              if (geometry.type === "Polygon") {
                return (
                  <Polygon
                    key={`${index}-${featureIndex}`}
                    positions={convertedCoordinates}
                    pathOptions={{ color: "purple" }}
                  >
                    <Popup>
                      <div className="flex flex-col">
                        <div>
                          <strong>Nome:</strong> {item.name}
                        </div>
                        <div>
                          <strong>Tamanho:</strong> {item.size} ha
                        </div>
                        <div>
                          <strong>Município:</strong>{" "}
                          {feature.properties?.municipio}
                        </div>
                        <div>
                          <strong>Status:</strong> {feature.properties?.ind_status}
                        </div>
                      </div>
                    </Popup>
                  </Polygon>
                );
              } else if (geometry.type === "MultiPolygon") {
                return convertedCoordinates.map((coords, polyIndex) => (
                  <Polygon
                    key={`${index}-${featureIndex}-${polyIndex}`}
                    positions={coords}
                    pathOptions={{ color: gerarCorAleatoria() }}
                  >
                    <Popup>
                      <div className="flex flex-col">
                        <div>
                          <strong>Nome:</strong> {item.name}
                        </div>
                        <div>
                          <strong>Tamanho:</strong> {item.size} ha
                        </div>
                        <div>
                          <strong>Município:</strong>{" "}
                          {feature.properties?.municipio}
                        </div>
                        <div>
                          <strong>Status:</strong> {feature.properties?.cod_imovel}
                        </div>
                      </div>
                    </Popup>
                  </Polygon>
                ));
              }
            }

            return null;
          });
        } else {
          console.error(
            `As features do item ${index} não são um array:`,
            item.features
          );
          return null;
        }
      })}
    </MapContainer>
  );
};

export default MapLeaflet;
