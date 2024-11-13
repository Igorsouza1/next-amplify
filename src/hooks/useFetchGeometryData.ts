import { useState, useEffect } from "react";
import { getInitialGeometry } from "@/app/_actions/actions";
import { GeometryData } from "@/@types/geomtry";

export const useFetchGeometryData = () => {
  const [geometryData, setGeometryData] = useState<GeometryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInitialGeometry();
        const parsedData = data?.map((item) => ({
          ...item,
          name: item.name ?? "",
          features:
            typeof item.features === "string"
              ? JSON.parse(item.features).features
              : item.features,
        }));
        setGeometryData(parsedData?.map(item => ({
          ...item,
          color: item.color ?? '',
        })) ?? []);
      } catch (error) {
        console.error("Erro ao obter dados de geometria:", error);
      }
    };

    fetchData();
  }, []);

  return geometryData;
};
