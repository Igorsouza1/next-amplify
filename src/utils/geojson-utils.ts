// utils/geojson-utils.ts
type Coordinate = [number, number];
type LinearRing = Coordinate[];
type Polygon = LinearRing[];
type MultiPolygon = Polygon[];

type Geometry = {
  type: string;
  coordinates: Coordinate | Coordinate[] | Polygon | MultiPolygon;
};

/**
 * Converte as coordenadas GeoJSON em formato compatível com o Leaflet
 * @param geometry - A geometria no formato GeoJSON
 * @returns Coordenadas compatíveis com o Leaflet
 */
export const convertGeoJSONToLeaflet = (geometry: Geometry): Coordinate[][] | null => {
  console.log("Geometry Type", geometry.type);

  if (geometry.type === "Polygon") {
    // Verifica se 'coordinates' é do tipo Polygon
    if (Array.isArray(geometry.coordinates) && Array.isArray(geometry.coordinates[0])) {
      const polygon = geometry.coordinates as Polygon;
      return polygon.map((ring) => ring.map((coord) => [coord[1], coord[0]] as Coordinate));
    }
  } else if (geometry.type === "MultiPolygon") {
    // Verifica se 'coordinates' é do tipo MultiPolygon
    if (
      Array.isArray(geometry.coordinates) &&
      Array.isArray(geometry.coordinates[0]) &&
      Array.isArray(geometry.coordinates[0][0])
    ) {
      const multiPolygon = geometry.coordinates as MultiPolygon;
      return multiPolygon.flatMap((polygon) =>
        polygon.map((ring) => ring.map((coord) => [coord[1], coord[0]] as Coordinate))
      );
    }
  }

  console.log("convertGeoJSONToLeaflet", null);
  return null; // Retorna null se o tipo de geometria não for suportado
};
