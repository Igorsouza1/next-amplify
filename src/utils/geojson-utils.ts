import proj4 from "proj4";

// Definir a projeção UTM para WGS84 (padrão de latitude/longitude)
const utm21S = "+proj=utm +zone=21 +south +datum=WGS84 +units=m +no_defs";

// Tipos para Polygon e MultiPolygon
type LatLngTuple = [number, number];
type PolygonCoordinates = LatLngTuple[][]; 
type MultiPolygonCoordinates = LatLngTuple[][][];

// Função para converter coordenadas de UTM para Latitude/Longitude
export function convertPolygonStringToLatLngTuples(polygonString: string): MultiPolygonCoordinates {
  try {
    const polygonData = JSON.parse(polygonString);

    // Verificar se a estrutura de coordinates e type existem
    if (!polygonData.coordinates || !polygonData.type) {
      console.error("convertPolygonStringToLatLngTuples: Formato inválido.");
      return [];
    }

    const { type, coordinates } = polygonData;

    if (type === "Polygon") {
      return [convertCoordinatesArray(coordinates as number[][][])];
    } else if (type === "MultiPolygon") {
      console.log("convertPolygonStringToLatLngTuples: MultiPolygon encontrado");
      return (coordinates as number[][][][]).map((polygon) => convertCoordinatesArray(polygon));
    } else {
      console.error(`convertPolygonStringToLatLngTuples: Tipo de geometria "${type}" não suportado.`);
      return [];
    }
  } catch (error) {
    console.error("convertPolygonStringToLatLngTuples: Erro ao converter a string de geometria:", error);
    return [];
  }
}

// Função auxiliar para converter uma array de coordenadas
function convertCoordinatesArray(coordinates: number[][][]): PolygonCoordinates {
  return coordinates.map((ring: number[][]) => {
    return ring.map((coordinatePair: number[]) => {
      if (coordinatePair.length === 2) {
        const [x, y] = coordinatePair;
        // Converter de UTM para Latitude/Longitude
        const [lng, lat] = proj4(utm21S, "WGS84", [x, y]) as [number, number];
        return [lat, lng];
      } else {
        console.error("convertPolygonStringToLatLngTuples: Par de coordenadas inválido:", coordinatePair);
        return [0, 0]; // Retornar uma coordenada padrão para evitar erro de tipagem
      }
    });
  });
}
