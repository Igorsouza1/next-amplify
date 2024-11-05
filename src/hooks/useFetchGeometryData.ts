import { useState, useEffect } from "react";
import { getGeoEntities } from "@/app/_actions/actions";
import { GeometryData, Feature, Geometry } from "@/@types/geomtry";

export const useFetchGeometryData = () => {
  const [geometryData, setGeometryData] = useState<GeometryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGeoEntities();
        const parsedData = data?.map((item) => ({
          id: item.id ?? '',
          name: item.Name ?? '',
          type: item.Type ?? '',
          // Verifica se Geometry está no formato correto; se não, define um valor padrão.
          geometry: (item.Geometry as Geometry) ?? { type: "Polygon", coordinates: [] },
          // Garante que Features esteja em um array de Feature[]; define um array vazio como padrão.
          features: Array.isArray(item.Features) ? (item.Features as Feature[]) : [],
          municipio: item.Municipio ?? '',
          areaHa: parseFloat(item.AreaHa ?? '') || 0,
          dataDetec: item.DataDetec ?? '',
          vPressao: item.VPressao ?? '',
          codImovel: item.Cod_Imovel ?? '',
          numArea: parseFloat(item.Num_Area ?? '') || 0,
          descSeg: item.DescSeg ?? null,
          tipoPNV: item.TipoPNV ?? null,
        }));

        setGeometryData(parsedData ?? []);
      } catch (error) {
        console.error("Erro ao obter dados de geometria:", error);
      }
    };

    fetchData();
  }, []);

  return geometryData;
};
