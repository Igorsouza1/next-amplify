export type Coordinate = [number, number];
export type LinearRing = Coordinate[];
export type PolygonType = LinearRing[];
export type MultiPolygon = PolygonType[];

export interface Geometry {
  type: string;
  coordinates: PolygonType | MultiPolygon;
}

export interface Feature {
  id: string;
  type: "Feature";
  properties: {
    COD_TEMA?: string;
    NOM_TEMA?: string;
    COD_IMOVEL?: string;
    MOD_FISCAL?: number;
    NUM_AREA?: number;
    IND_STATUS?: string;
    IND_TIPO?: string;
    DES_CONDIC?: string;
    MUNICIPIO?: string;
    COD_ESTADO?: string;
  };
  geometry: Geometry;
}

export interface GeometryData {
  id: string;
  name: string;
  size: string;
  color: string;
  features: Feature[];
}
