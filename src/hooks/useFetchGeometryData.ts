import { useState, useEffect } from "react";
import { getInitialGeometry } from "@/app/_actions/actions";
import { GeometryData, Feature } from "@/@types/geomtry";
import { fetchAuthSession } from 'aws-amplify/auth';


// Feature crua pode ser uma string ou um array de `Feature`.
type RAWFeature = string | Feature[];


export const useFetchGeometryData = () => {
  const [geometryData, setGeometryData] = useState<GeometryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


 /**
   * Processa a propriedade `features` e retorna um array de `Feature[]`.
   * @param features - Dados crus da propriedade `features` no formato `RawFeatures`.
   * @returns Um array de `Feature[]`.
   */
  const parseFeatures = (features: RAWFeature): Feature[] => {
    if (typeof features === "string") {
      try {
        const parsed = JSON.parse(features); // Tenta parsear a string JSON
        return Array.isArray(parsed.features) ? parsed.features : []; // Verifica se `parsed.features` é um array
      } catch {
        console.error("Erro ao parsear features:", features);
        return [];
      }
    }
    return Array.isArray(features) ? features : []; // Retorna diretamente se já for um array
  };



  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getInitialGeometry();

      // Processa os dados e garante que estejam no formato GeometryData[]
      const parsedData: GeometryData[] = data?.map((item) => ({
        id: item.id,
        name: item.name ?? "",
        color: item.color ?? "",
        features: parseFeatures(item.features as RAWFeature)
      })) || [];

      setGeometryData(parsedData ?? []);
    } catch (error) {
      console.error("Erro ao obter dados de geometria:", error);
      setError("Falha ao carregar os dados de geometria.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { geometryData, loading, error };
};