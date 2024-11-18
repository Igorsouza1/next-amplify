'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { GeometryData } from "@/@types/geomtry";
import { useFetchGeometryData } from "@/hooks/useFetchGeometryData"; // Certifique-se de que o hook está sendo importado corretamente

type ShapeContextType = {
  availableShapes: GeometryData[];
  activeShapes: GeometryData[];
  addShape: (shape: GeometryData) => void;
  removeShape: (shapeId: string) => void;
  setAvailableShapes: React.Dispatch<React.SetStateAction<GeometryData[]>>;
  selectedFeature: FeatureProperties | null; // Tipagem mais restritiva
  setSelectedFeature: React.Dispatch<React.SetStateAction<FeatureProperties | null>>; // Atualização do setter
  loading: boolean;
};

interface FeatureProperties {
  [key: string]: string | number | boolean | null | undefined; // Propriedades dinâmicas
}

const ShapeContext = createContext<ShapeContextType | undefined>(undefined);

export const ShapeProvider = ({ children }: { children: ReactNode }) => {
  const fetchedShapes = useFetchGeometryData(); // Chama o hook que busca os shapes
  const [availableShapes, setAvailableShapes] = useState<GeometryData[]>([]);
  const [activeShapes, setActiveShapes] = useState<GeometryData[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<FeatureProperties | null>(null); // Estado para a feature clicada
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fetchedShapes.length > 0) {
      setAvailableShapes(fetchedShapes); // Atualiza o estado com os dados buscados
      setLoading(false); // Desativa o estado de carregamento
    }
  }, [fetchedShapes]);

  const addShape = (shape: GeometryData) => {
    setActiveShapes((prev) => [...prev, shape]);
  };

  const removeShape = (shapeId: string) => {
    setActiveShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
  };

  return (
    <ShapeContext.Provider
      value={{
        availableShapes,
        activeShapes,
        addShape,
        removeShape,
        setAvailableShapes,
        selectedFeature,
        setSelectedFeature,
        loading,
      }}
    >
      {children}
    </ShapeContext.Provider>
  );
};

export const useShapeContext = () => {
  const context = useContext(ShapeContext);
  if (!context) throw new Error("useShapeContext must be used within a ShapeProvider");
  return context;
};
