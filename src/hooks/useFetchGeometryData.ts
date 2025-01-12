import { useState, useEffect, useCallback } from "react";
import { getInitialGeometry } from "@/app/_actions/actions";
import { GeometryData, Feature } from "@/@types/geomtry";

type RAWFeature = string | Feature[];

export const useFetchGeometryData = () => {
  const [geometryData, setGeometryData] = useState<GeometryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Processa a propriedade `features` e retorna um array de `Feature[]`.
   * @param features - Dados crus da propriedade `features` no formato `RAWFeature`.
   * @returns Um array de `Feature[]`.
   */
  const parseFeatures = (features: RAWFeature): Feature[] => {
    if (typeof features === "string") {
      try {
        const parsed = JSON.parse(features);
        return Array.isArray(parsed.features) ? parsed.features : [];
      } catch {
        console.error("Erro ao parsear features:", features);
        return [];
      }
    }
    return Array.isArray(features) ? features : [];
  };

  /**
   * Função para buscar os dados de geometria. Está memoizada com `useCallback`
   * para garantir que a referência não mude entre renderizações.
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getInitialGeometry();

      const parsedData: GeometryData[] =
        data?.map((item) => ({
          id: item.id,
          name: item.name ?? "",
          color: item.color ?? "",
          features: parseFeatures(item.features as RAWFeature),
        })) || [];

      setGeometryData(parsedData);
    } catch (error) {
      console.error("Erro ao obter dados de geometria:", error);
      setError("Falha ao carregar os dados de geometria.");
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências porque `fetchData` não depende de variáveis externas.

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Agora, `fetchData` é estável.

  return { geometryData, loading, error };
};
