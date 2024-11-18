/**
 * Representa uma coordenada no formato GeoJSON.
 * [longitude, latitude]
 */
export type Coordinate = [number, number];

/**
 * Representa um anel linear (LinearRing), usado em polígonos.
 * É um array de coordenadas.
 */
export type LinearRing = Coordinate[];

/**
 * Representa um polígono no formato GeoJSON.
 * É um array de LinearRings.
 */
export type Polygon = LinearRing[];

/**
 * Representa um MultiPolygon no formato GeoJSON.
 * É um array de polígonos.
 */
export type MultiPolygon = Polygon[];

/**
 * Define os tipos válidos de geometria no GeoJSON.
 */
export type GeometryType = "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";

/**
 * Representa uma geometria no formato GeoJSON.
 */
export interface Geometry {
  type: GeometryType;
  coordinates:
    | Coordinate // Point
    | Coordinate[] // LineString, MultiPoint
    | LinearRing // Polygon (exterior)
    | Polygon // Polygon (com buracos)
    | MultiPolygon; // MultiPolygon
}

/**
 * Representa uma Feature no formato GeoJSON.
 */
export interface Feature {
  type: "Feature";
  properties: {
    COD_TEMA?: string;
    NOM_TEMA?: string;
    COD_IMOVEL?: string;
    MOD_FISCAL?: number;
    NUM_AREA?: number;
    SITUACAO?: string;
    IND_TIPO?: string;
    DES_CONDIC?: string;
    NOM_MUNICI?: string;
    COD_ESTADO?: string;
    nome?: string;
    fonte?: string;
    bioma?: string;
    municipio?: string;
    areaha?: number;
    datadetec?: string;
    sub_area?: number;
  } & Record<string, unknown>;
  geometry: Geometry;
}

export interface CRS {
  type: string;
  properties: {
    name: string;
  };
}

/**
 * Representa um conjunto de Features com metadados adicionais.
 */
export interface GeometryData {
  id: string;
  name: string;
  color: string;
  category: "Atividades" | "Desmatamento" | "Fogo" | "Outros" | "Propriedades";
  features: Feature[];
  crs?: CRS;
}
