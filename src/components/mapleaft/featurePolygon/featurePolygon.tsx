// components/FeaturePolygon.tsx
import { Polygon, Popup } from "react-leaflet";
import { Feature } from "@/@types/geomtry";
import { convertGeoJSONToLeaflet } from "@/utils/geojson-utils";
import React from "react";

interface FeaturePolygonProps {
  feature: Feature;
  parentName: string;
  parentSize: string;
  parentColor: string;
}

const FeaturePolygon = ({
  feature,
  parentName,
  parentSize,
  parentColor,
}: FeaturePolygonProps) => {
  const geometry = feature.geometry;
  const convertedCoordinates = convertGeoJSONToLeaflet(geometry);

  if (!convertedCoordinates) return null;

  // Verifica se o nome das propriedades é "Propriedades"
  const isPropriedades =
    parentName === "Propriedades" || parentName === "Novas Propriedades";
  const isDesmatamento = parentName === "Desmatamento" || parentName === "Desmatamento Bacia";

  const popupContent = (
    <Popup>
      <div className="flex flex-col">
        <div>
          <strong>Nome:</strong> {parentName}
        </div>
        {/* <div>
          <strong>Tamanho:</strong> {parentSize} ha
        </div> */}

        {/* Exibir somente se for "Propriedades" */}
        {isPropriedades && (
          <>
            {feature.properties?.NOM_MUNICI && (
              <div>
                <strong>Município:</strong> {feature.properties.NOM_MUNICI}
              </div>
            )}
            {feature.properties?.SITUACAO && (
              <div>
                <strong>Status:</strong> {feature.properties.SITUACAO}
              </div>
            )}
            {feature.properties?.COD_IMOVEL && (
              <div>
                <strong>CAR:</strong> {feature.properties.COD_IMOVEL}
              </div>
            )}

            {feature.properties?.nome && (
              <div>
                <strong>Nome:</strong> {feature.properties.nome}
              </div>
            )}
            {feature.properties?.NUM_AREA && (
              <div>
                <strong>Tamanho:</strong>{" "}
                {feature.properties.NUM_AREA.toFixed(2)} Ha
              </div>
            )}
          </>
        )}

        {isDesmatamento && (
          <>
            {feature.properties?.bioma && (
              <div>
                <strong>Bioma:</strong> {feature.properties.bioma}
              </div>
            )}
            {feature.properties?.municipio && (
              <div>
                <strong>Município:</strong> {feature.properties.municipio}
              </div>
            )}
            {feature.properties?.area_ha && (
              <div>
                <strong>Área (ha):</strong> {feature.properties.area_ha}
              </div>
            )}
            {feature.properties?.datadetec && (
              <div>
                <strong>Data de Detecção:</strong>{" "}
                {new Date(feature.properties.datadetec).toLocaleDateString()}
              </div>
            )}
          </>
        )}
      </div>
    </Popup>
  );

  if (geometry.type === "Polygon") {
    return (
      <Polygon
        positions={convertedCoordinates}
        pathOptions={{ color: parentColor }}
      >
        {popupContent}
      </Polygon>
    );
  }

  if (geometry.type === "MultiPolygon") {
    return (
      <>
        {convertedCoordinates.map((coords, index) => (
          <Polygon
            key={index}
            positions={coords}
            pathOptions={{ color: parentColor }}
          >
            {popupContent}
          </Polygon>
        ))}
      </>
    );
  }

  return null;
};

export default FeaturePolygon;
