// utils/geojson-utils.ts

type Coordinate = [number, number];
type Geometry = {
  type: string;
  coordinates: any;
};

/**
 * Converte as coordenadas GeoJSON em formato compatível com o Leaflet
 * @param geometry - A geometria no formato GeoJSON
 * @returns Coordenadas compatíveis com o Leaflet
 */
export const convertGeoJSONToLeaflet = (geometry: Geometry): Coordinate[][] | null => {
  console.log("Geomtry Type", geometry.type)
  if (geometry.type === "Polygon") {
    // Converte um polígono simples
    console.log("convertGeoJSONToLeaflet", geometry.coordinates[0])
    return geometry.coordinates[0].map((coord: Coordinate) => [coord[1], coord[0]]);
  } else if (geometry.type === "MultiPolygon") {
    // Converte múltiplos polígonos	
    console.log("convertGeoJSONToLeaflet", geometry.coordinates)
    return geometry.coordinates.map((polygon: any) =>
      polygon[0].map((coord: Coordinate) => [coord[1], coord[0]])
    );
  }
  console.log("convertGeoJSONToLeaflet", null)
  return null; // Retorna null se o tipo de geometria não for suportado
};
