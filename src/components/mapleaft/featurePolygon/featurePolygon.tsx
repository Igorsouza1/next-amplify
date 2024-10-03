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

  // Verifica se o nome das propriedades é "Propriedades"
  const isPropriedades = feature.properties && 
   (parentName.toLowerCase() === "propriedades".toLowerCase() || 
    parentName.toLowerCase() === "multifeature".toLowerCase());


    console.log("Feature Properties:", feature.properties);
    console.log("Feature properties:", feature.properties);
    console.log("Município:", feature.properties?.MUNICIPIO);
    console.log("Status:", feature.properties?.IND_STATUS);
    console.log("CAR:", feature.properties?.COD_IMOVEL);
      console.log("IsPropriedade: ",isPropriedades);
      console.log("ParentName",parentName)

  const popupContent = (
    <Popup>
      <div className="flex flex-col">
        <div>
          <strong>Nome:</strong> {parentName}
        </div>
        <div>
          <strong>Tamanho:</strong> {parentSize} ha
        </div>

        {/* Exibir somente se for "Propriedades" */}
        {isPropriedades && (
          <>
            {feature.properties?.MUNICIPIO && (
              <div>
                <strong>Município:</strong> {feature.properties.MUNICIPIO}
              </div>
            )}
            {feature.properties?.IND_STATUS && (
              <div>
                <strong>Status:</strong> {feature.properties.IND_STATUS}
              </div>
            )}
            {feature.properties?.COD_IMOVEL && (
              <div>
                <strong>CAR:</strong> {feature.properties.COD_IMOVEL}
              </div>
            )}
          </>
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
