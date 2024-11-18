import { GeometryData, Feature, Geometry, GeometryType, Coordinate, Polygon, MultiPolygon } from '@/@types/geomtry';

/**
 * Converte as coordenadas GeoJSON em formato compatível com o Leaflet.
 * @param geometry - A geometria no formato GeoJSON.
 * @returns Coordenadas compatíveis com o Leaflet ou null para tipos não suportados.
 */
export const convertGeoJSONToLeaflet = (geometry: Geometry): Coordinate[][] | null => {
  if (geometry.type === "Polygon") {  
    if (Array.isArray(geometry.coordinates) && Array.isArray(geometry.coordinates[0])) {
      const polygon = geometry.coordinates as Polygon;
      return polygon.map((ring) => ring.map(([lon, lat]) => [lat, lon] as Coordinate));
    }
  } else if (geometry.type === "MultiPolygon") {
    if (
      Array.isArray(geometry.coordinates) &&
      Array.isArray(geometry.coordinates[0]) &&
      Array.isArray(geometry.coordinates[0][0])
    ) {
      const multiPolygon = geometry.coordinates as MultiPolygon;
      return multiPolygon.flatMap((polygon) =>
        polygon.map((ring) => ring.map(([lon, lat]) => [lat, lon] as Coordinate))
      );
    }
  } else if (geometry.type === "MultiLineString") {
    if (
      Array.isArray(geometry.coordinates) &&
      Array.isArray(geometry.coordinates[0]) &&
      Array.isArray(geometry.coordinates[0][0])
    ) {
      const multiLineString = geometry.coordinates as Coordinate[][];
      return multiLineString.map((line) =>
        line.map(([lon, lat]) => [lat, lon] as Coordinate)
      );
    }
  }
  
  console.warn("Unsupported geometry type:", geometry.type);
  return null; // Retorna null para tipos de geometria não suportados.
};

//====================================================================================================


/**
 * Valida se uma coordenada é válida no formato GeoJSON.
 */
const isValidCoordinate = (coord: any): coord is Coordinate =>
  Array.isArray(coord) && coord.length === 2 && coord.every((value) => typeof value === 'number');

/**
 * Valida se uma LineString ou MultiPoint é válida.
 */
const isValidCoordinateArray = (coords: any): coords is Coordinate[] =>
  Array.isArray(coords) && coords.every(isValidCoordinate);

/**
 * Valida se um Polygon é válido.
 */
const isValidPolygon = (polygon: any): polygon is Polygon =>
  Array.isArray(polygon) && polygon.every(isValidCoordinateArray);

/**
 * Valida se um MultiPolygon é válido.
 */
const isValidMultiPolygon = (multiPolygon: any): multiPolygon is MultiPolygon =>
  Array.isArray(multiPolygon) && multiPolygon.every(isValidPolygon);




/**
 * Mapeia o tipo de geometria para a função de validação correspondente.
 */
const geometryValidators: Record<GeometryType, (coords: any) => boolean> = {
  Point: isValidCoordinate,
  LineString: isValidCoordinateArray,
  MultiPoint: isValidCoordinateArray,
  Polygon: isValidPolygon,
  MultiLineString: isValidCoordinateArray, // Para simplificação, assumindo que é similar a LineString
  MultiPolygon: isValidMultiPolygon,
};

/**
 * Valida se uma geometria é válida com base no tipo e nas coordenadas.
 */
const isValidGeometry = (geometry: any): geometry is Geometry =>
  geometry &&
  typeof geometry.type === 'string'

/**
 * Valida se uma Feature é válida no formato GeoJSON.
 */
const isValidFeature = (feature: any): feature is Feature =>
  feature &&
  feature.type === 'Feature' &&
  isValidGeometry(feature.geometry) &&
  typeof feature.properties === 'object';

/**
 * Valida se o objeto é um GeometryData válido.
 */
export const isValidGeometryData = (data: any): data is GeometryData => {
  console.log(typeof data);
  if (!data || typeof data !== 'object') {
    console.error("Validação falhou: O objeto principal não é válido.");
    return false;
  }

  const { name, features, crs } = data;

 
  // Validação de `name`
  if (typeof name !== 'string') {
    console.error("Validação falhou: 'name' deve ser uma string. Valor recebido:", name);
    return false;
  }

  // Validação de `features`
  if (!Array.isArray(features)) {
    console.error("Validação falhou: 'features' deve ser um array. Valor recebido:", features);
    return false;
  }

  if (!features.every(isValidFeature)) {
    console.error("Validação falhou: Nem todas as features são válidas.");
    features.forEach((feature, index) => {
      if (!isValidFeature(feature)) {
        console.error(`Feature inválida na posição ${index}:`, feature);
      }
    });
    return false;
  }

 

  console.log("GeoJSON validado com sucesso:", data);
  return true;
};


//====================================================================================================