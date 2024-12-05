'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { GeometryData, Feature } from "@/@types/geomtry";
import { useFetchGeometryData } from "@/hooks/useFetchGeometryData";
import { GetUniqueActions } from "@/app/_actions/actions"; // Certifique-se de que a importação está correta

type UniqueAction = {
  acao: string;
  count: number;
};

type ShapeContextType = {
  availableShapes: GeometryData[];
  activeShapes: GeometryData[];
  addShape: (shape: GeometryData) => void;
  removeShape: (shapeId: string) => void;
  setAvailableShapes: React.Dispatch<React.SetStateAction<GeometryData[]>>;
  selectedFeature: Feature | null;
  setSelectedFeature: React.Dispatch<React.SetStateAction<Feature | null>>;
  loading: boolean;
  uniqueActions: UniqueAction[];
  setUniqueActions: React.Dispatch<React.SetStateAction<UniqueAction[]>>;
  activePoints: any[];
  addPoints: (points: any[]) => void;
  removePoints: (action: string) => void;
};

const ShapeContext = createContext<ShapeContextType | undefined>(undefined);

export const ShapeProvider = ({ children }: { children: ReactNode }) => {
  const fetchedShapes = useFetchGeometryData();
  const [availableShapes, setAvailableShapes] = useState<GeometryData[]>([]);
  const [activeShapes, setActiveShapes] = useState<GeometryData[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);

  // Novos estados
  const [uniqueActions, setUniqueActions] = useState<UniqueAction[]>([]);
  const [activePoints, setActivePoints] = useState<any[]>([]);

  // Fetch Shapes
  useEffect(() => {
    if (fetchedShapes.length > 0) {
      setAvailableShapes(fetchedShapes);
      setLoading(false);
    }
  }, [fetchedShapes]);

  // Fetch Unique Actions
  useEffect(() => {
    const fetchUniqueActions = async () => {
      try {
        const actions = await GetUniqueActions();
        setUniqueActions(actions); // Atualiza o estado com as ações únicas
        console.log("Unique Actions fetched:", actions);
      } catch (error) {
        console.error("Error fetching unique actions:", error);
      }
    };

    fetchUniqueActions();
  }, []);

  const addShape = (shape: GeometryData) => {
    setActiveShapes((prev) => [...prev, shape]);
  };

  const removeShape = (shapeId: string) => {
    setActiveShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
  };

  const addPoints = (points: any[]) => {
    setActivePoints((prev) => [...prev, ...points]);
  };

  const removePoints = (action: string) => {
    setActivePoints((prev) => prev.filter((point) => point.acao !== action));
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
        uniqueActions,
        setUniqueActions,
        activePoints,
        addPoints,
        removePoints,
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
