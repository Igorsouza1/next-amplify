// components/FeaturePolygon.tsx
import { Polygon, Popup } from "react-leaflet";
import { Feature } from "@/@types/geomtry";
import { convertGeoJSONToLeaflet } from "@/utils/geojson-utils";

interface FeaturePolygonProps {
  feature: Feature;
  parentName: string;
  parentSize: string;
  parentColor: string;
}

const FeaturePolygon = ({ feature, parentName, parentSize, parentColor }: FeaturePolygonProps) => {
  const geometry = feature.geometry;
  const convertedCoordinates = convertGeoJSONToLeaflet(geometry);

  if (!convertedCoordinates) return null;

  const popupContent = (
    <Popup>
      <div className="flex flex-col">
        <div>
          <strong>Nome:</strong> {parentName}
        </div>
        <div>
          <strong>Tamanho:</strong> {parentSize} ha
        </div>
        {/* Verifica se o município existe antes de renderizar */}
        {feature.properties?.municipio && (
          <div>
            <strong>Município:</strong> {feature.properties.municipio}
          </div>
        )}
        {/* Verifica se o status existe antes de renderizar */}
        {feature.properties?.ind_status && (
          <div>
            <strong>Status:</strong> {feature.properties.ind_status}
          </div>
        )}
        {/* Verifica se o CAR (cod_imovel) existe antes de renderizar */}
        {feature.properties?.cod_imovel && (
          <div>
            <strong>CAR:</strong> {feature.properties.cod_imovel}
          </div>
        )}
      </div>
    </Popup>
  );


  if (geometry.type === "Polygon") {
    return (
      <Polygon positions={convertedCoordinates} pathOptions={{ color: parentColor }}>
        {popupContent}
      </Polygon>
    );
  }

  if (geometry.type === "MultiPolygon") {
    return (
      <>
        {convertedCoordinates.map((coords, index) => (
          <Polygon key={index} positions={coords} pathOptions={{ color: parentColor }}>
            {popupContent}
          </Polygon>
        ))}
      </>
    );
  }

  return null;
};


export default FeaturePolygon;
