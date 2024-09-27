export type Coordinate = [number, number];
export type LinearRing = Coordinate[];
export type PolygonType = LinearRing[];
export type MultiPolygon = PolygonType[];

export interface Geometry {
  type: string;
  coordinates: PolygonType | MultiPolygon;
}

export interface Feature {
  type: "Feature";
  properties: {
    cod_tema?: string;
    nom_tema?: string;
    cod_imovel?: string;
    mod_fiscal?: number;
    num_area?: number;
    ind_status?: string;
    ind_tipo?: string;
    des_condic?: string;
    municipio?: string;
    cod_estado?: string;
  };
  geometry: Geometry;
}

export interface GeometryData {
  name: string;
  size: string;
  color: string;
  features: Feature[];
}
