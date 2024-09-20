import proj4 from "proj4";

// Definir a projeção UTM para WGS84 (padrão de latitude/longitude)
const utm21S = "+proj=utm +zone=21 +south +datum=WGS84 +units=m +no_defs";

// Função para converter coordenadas de UTM para Latitude/Longitude
export function convertPolygonStringToLatLngTuples(polygonString: string): [number, number][][] {
  try {

    const polygonData = JSON.parse(polygonString);

    // Verifica se a estrutura de coordinates existe e é um array
    if (!polygonData.coordinates || !Array.isArray(polygonData.coordinates)) {
      console.error("convertPolygonStringToLatLngTuples: Formato de coordinates inválido.");
      return [];
    }

    const latLngTuples = polygonData.coordinates.map((ring: number[][]) => {
      return ring.map((coordinatePair: number[]) => {
        if (coordinatePair.length === 2) {
          const [x, y] = coordinatePair;

          // Converter de UTM para Latitude/Longitude
          const [lng, lat] = proj4(utm21S, "WGS84", [x, y]);


          return [lat, lng] as [number, number];
        } else {
          console.error("convertPolygonStringToLatLngTuples: Par de coordenadas inválido:", coordinatePair);
          return [];
        }
      });
    });

    return latLngTuples;
  } catch (error) {
    console.error("convertPolygonStringToLatLngTuples: Erro ao converter a string de geometria:", error);
    return [];
  }
}
