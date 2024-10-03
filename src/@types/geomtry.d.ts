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
    SITUACAO?: string;
    IND_TIPO?: string;
    DES_CONDIC?: string;
    NOM_MUNICI?: string;
    COD_ESTADO?: string;
    nome?: string;
    fonte?: string;
    bioma?: string;
    municipio?: string;
    area_ha?: number;
    datadetec?: string;
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
