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
    sub_area?: number;
    
    // Novas propriedades de desmatamento, propriedades e estradas
    Municipio?: string;
    AreaHa?: number;
    DataDetec?: string;
    VPressao?: string;
    Cod_Imovel?: string;
    Num_Area?: number;
    DescSeg?: string | null;
    TipoPNV?: string | null;
  };
  geometry: Geometry;
}

export interface GeometryData {
  id: string;
  name: string;
  type: string;
  size?: string;
  color?: string;
  geometry: Geometry;
  features: Feature[];
  municipio?: string;
  areaHa?: number;
  dataDetec?: string;
  vPressao?: string;
  codImovel?: string;
  numArea?: number;
  descSeg?: string | null;
  tipoPNV?: string | null;
}
