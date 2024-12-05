import { GeometryData, Feature, Geometry, GeometryType, Coordinate, Polygon, MultiPolygon, LinearRing } from '@/@types/geomtry';
import { v4 as uuidv4 } from 'uuid';




// ===================================================================================================

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
// REDUZIR A COMPLEXIDADE DA GEOMETRY
/**
 * Reduz a precisão de coordenadas em uma estrutura GeoJSON.
 *
 * @param coordinates - As coordenadas do GeoJSON.
 * @param precision - O número de casas decimais para manter.
 * @returns As coordenadas com precisão reduzida.
 */





// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reducePrecision = (coordinates: any, precision: number): any => {
  if (Array.isArray(coordinates[0])) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return coordinates.map((coord: any) => reducePrecision(coord, precision));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return coordinates.map((val: any) => parseFloat(val.toFixed(precision)));
};


//====================================================================================================




/**
 * Lê um arquivo GeoJSON e processa seus dados.
 * 
 * @param file - O arquivo GeoJSON a ser lido.
 * @param precision - Número de casas decimais para reduzir nas coordenadas (padrão: 5).
 * @returns Uma Promise com os dados processados ou um erro.
 */
export const readGeoJSONFile = async (file: File, precision: number = 5): Promise<GeometryData> => {
  if (!file.name.endsWith('.geojson')) {
    throw new Error('Invalid file type. Please upload a GeoJSON file.');
  }

  const fileContent = await file.text();
  const json = JSON.parse(fileContent) as GeometryData;

  if (!isValidGeometryData(json)) {
    throw new Error('Invalid GeoJSON structure or CRS.');
  }

  const featuresWithIds: Feature[] = json.features.map((feature) => ({
    ...feature,
    id: feature.id || uuidv4(), // Adiciona ID único se não existir
    geometry: {
      ...feature.geometry,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      coordinates: reducePrecision(feature.geometry.coordinates, precision),
    },
  }));

  return {
    ...json,
    features: featuresWithIds,
  };
};




// ===================================================================================================
// LIMPA AS PROPRETIES

/**
 * Filtra as propriedades de uma feature GeoJSON, mantendo apenas as especificadas.
 *
 * @param feature - A feature do GeoJSON.
 * @param allowedProperties - Lista de propriedades permitidas.
 * @returns Uma nova feature com propriedades filtradas.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterFeatureProperties = (feature: any, allowedProperties: string[]): any => {
  return {
    ...feature,
    properties: Object.fromEntries(
      Object.entries(feature.properties).filter(([key]) => allowedProperties.includes(key))
    ),
  };
};










// ===================================================================================================











/**
 * Valida se uma coordenada é válida no formato GeoJSON.
 */
const isValidCoordinate = (coord: unknown): coord is Coordinate =>
  Array.isArray(coord) &&
  coord.length === 2 &&
  typeof coord[0] === 'number' &&
  typeof coord[1] === 'number';

/**
 * Valida se um LinearRing (array de coordenadas) é válido.
 */
const isValidLinearRing = (coords: unknown): coords is LinearRing =>
  Array.isArray(coords) && coords.every(isValidCoordinate);

/**
 * Valida se um Polygon é válido.
 */
const isValidPolygon = (polygon: unknown): polygon is Polygon =>
  Array.isArray(polygon) && polygon.every(isValidLinearRing);

/**
 * Valida se um MultiPolygon é válido.
 */
const isValidMultiPolygon = (multiPolygon: unknown): multiPolygon is MultiPolygon =>
  Array.isArray(multiPolygon) && multiPolygon.every(isValidPolygon);

/**
 * Valida se um array de coordenadas é válido (utilizado por LineString e MultiPoint).
 */
const isValidCoordinateArray = (coords: unknown): coords is Coordinate[] =>
  Array.isArray(coords) && coords.every(isValidCoordinate);

/**
 * Valida se uma geometria é válida com base no tipo e nas coordenadas.
 */
const isValidGeometry = (geometry: unknown): geometry is Geometry => {
  if (typeof geometry === 'object' && geometry !== null) {
    const { type, coordinates } = geometry as Geometry;
    switch (type) {
      case 'Point':
        return isValidCoordinate(coordinates);
      case 'LineString':
        return isValidCoordinateArray(coordinates);
      case 'Polygon':
        return isValidPolygon(coordinates);
      case 'MultiPoint':
        return isValidCoordinateArray(coordinates);
      case 'MultiLineString':
        return Array.isArray(coordinates) &&
          coordinates.every((line) => Array.isArray(line) && line.every(isValidCoordinate));
      case 'MultiPolygon':
        return isValidMultiPolygon(coordinates);
      default:
        console.error('Tipo de geometria desconhecido:', type);
        return false;
    }
  }
  return false;
};

/**
 * Valida se uma Feature é válida no formato GeoJSON.
 */
const isValidFeature = (feature: unknown): feature is Feature => {
  if (typeof feature === 'object' && feature !== null) {
    const { type, geometry, properties } = feature as Feature;
    return (
      type === 'Feature' &&
      isValidGeometry(geometry) &&
      typeof properties === 'object' &&
      properties !== null
    );
  }
  return false;
};

/**
 * Valida se o objeto é um GeometryData válido.
 */
export const isValidGeometryData = (data: unknown): data is GeometryData => {
  if (typeof data === 'object' && data !== null) {
    const { name, features, crs } = data as GeometryData;

    if (typeof name !== 'string') {
      console.error("Validação falhou: 'name' deve ser uma string. Valor recebido:", name);
      return false;
    }

    // if (!Array.isArray(features) || !features.every(isValidFeature)) {
    //   console.error('Validação falhou: Nem todas as features são válidas.');
    //   return false;
    // }

    if (crs && typeof crs !== 'object') {
      console.error("Validação falhou: 'crs' deve ser um objeto válido.");
      return false;
    }

    return true;
  }

  console.error('Validação falhou: O objeto principal não é válido.');
  return false;
};

/**
 * Mapeia validadores para os tipos de geometria suportados.
 */
const geometryValidators: Record<GeometryType, (coords: unknown) => boolean> = {
  Point: isValidCoordinate,
  LineString: isValidCoordinateArray,
  MultiPoint: isValidCoordinateArray,
  Polygon: isValidPolygon,
  MultiLineString: (coords) =>
    Array.isArray(coords) && coords.every((line) => Array.isArray(line) && line.every(isValidCoordinate)),
  MultiPolygon: isValidMultiPolygon,
};