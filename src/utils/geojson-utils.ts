import proj4 from "proj4";

// Definir a projeção UTM para WGS84 (padrão de latitude/longitude)
const utm21S = "+proj=utm +zone=21 +south +datum=WGS84 +units=m +no_defs";

// Tipos para coordenadas
type LatLngTuple = [number, number];
type PolygonCoordinates = LatLngTuple[][];
type MultiPolygonCoordinates = LatLngTuple[][][];
type GeometryType = "Polygon" | "MultiPolygon";

// Interface para os dados da geometria
interface GeometryData {
  name: string;
  geometry: {
    type: GeometryType;
    coordinates: any;
  };
}

// Função para processar o array de dados de geometria
export function convertGeometryArrayToLatLngTuples(dataArray: GeometryData[]): MultiPolygonCoordinates[] {
  return dataArray.map(item => {
    if (item.geometry) {
      return convertGeometryToLatLngTuples(item.geometry) || [];
    } else {
      console.error(`convertGeometryArrayToLatLngTuples: O item ${item.name} não possui geometria.`);
      return [];
    }
  });
}

// Função para converter a geometria de UTM para Latitude/Longitude
export function convertGeometryToLatLngTuples(geometry: { type: GeometryType; coordinates: any }): MultiPolygonCoordinates | null {
  try {
    const { type, coordinates } = geometry;

    if (type === "Polygon") {
      return [convertCoordinatesArray(coordinates as number[][][])];
    } else if (type === "MultiPolygon") {
      return (coordinates as number[][][][]).map(polygon => convertCoordinatesArray(polygon));
    } else {
      console.error(`convertGeometryToLatLngTuples: Tipo de geometria "${type}" não suportado.`);
      return null;
    }
  } catch (error) {
    console.error("convertGeometryToLatLngTuples: Erro ao converter a geometria:", error);
    return null;
  }
}

// Função auxiliar para converter um array de coordenadas
function convertCoordinatesArray(coordinates: number[][][]): PolygonCoordinates {
  return coordinates.map((ring: number[][]) => {
    return ring.map((coordinatePair: number[]) => {
      if (coordinatePair.length === 2) {
        const [x, y] = coordinatePair;
        // Converter de UTM para Latitude/Longitude
        const [lng, lat] = proj4(utm21S, "WGS84", [x, y]) as [number, number];
        return [lat, lng];
      } else {
        console.error("convertCoordinatesArray: Par de coordenadas inválido:", coordinatePair);
        return [0, 0]; // Retornar uma coordenada padrão para evitar erro de tipagem
      }
    });
  });
}
