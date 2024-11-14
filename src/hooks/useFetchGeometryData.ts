import { useState, useEffect } from "react";
import { getInitialGeometry } from "@/app/_actions/actions";
import { GeometryData } from "@/@types/geomtry";

export const useFetchGeometryData = () => {
  const [geometryData, setGeometryData] = useState<GeometryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInitialGeometry();

        const parsedData = data?.map((item) => {
          const features =
            typeof item.features === "string"
              ? JSON.parse(item.features).features
              : item.features;

          return {
            id: item.id,
            name: item.name ?? "",
            color: item.color ?? "",
            features: features ?? [],
          } as GeometryData;
        });

        setGeometryData(parsedData ?? []);
      } catch (error) {
        console.error("Erro ao obter dados de geometria:", error);
      }
    };

    fetchData();
  }, []);

  return geometryData;
};
