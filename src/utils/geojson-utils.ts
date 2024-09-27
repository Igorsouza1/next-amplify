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
  if(typeof geometry === "string"){
    geometry = JSON.parse(geometry)
  }
  // console.log("Geometry Type", geometry.type);

  if (geometry.type === "Polygon") {

    // Verifica se 'coordinates' é do tipo Polygon
    if (Array.isArray(geometry.coordinates) && Array.isArray(geometry.coordinates[0])) {
      const polygon = geometry.coordinates as Polygon;

      // Para cada "anel" (ring) do polígono, invertemos as coordenadas de [longitude, latitude] para [latitude, longitude].
      // Isso é necessário porque o Leaflet espera as coordenadas nesse formato, e o GeoJSON as armazena ao contrário.
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

      // Para cada polígono (polygon) dentro do MultiPolygon, invertemos as coordenadas de [longitude, latitude] para [latitude, longitude].
      // Usamos 'flatMap' para retornar todas as coordenadas em um único array, garantindo que cada anel dentro de cada polígono seja convertido para o formato esperado pelo Leaflet.
      return multiPolygon.flatMap((polygon) =>
        polygon.map((ring) => ring.map((coord) => [coord[1], coord[0]] as Coordinate))
      );
    }
  }

  console.log("O desenho não foi convertido");
  return null; // Retorna null se o tipo de geometria não for suportado
};
