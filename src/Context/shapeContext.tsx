'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { GeometryData, Feature } from "@/@types/geomtry";
import { useFetchGeometryData } from "@/hooks/useFetchGeometryData";
import { useFetchUniqueActions } from '@/hooks/useFetchUniqueActions';

 

type UniqueAction = {
  acao: string;
  count: number;
};


interface ActivePoint {
  latitude: number;
  longitude: number;
  name: string;
  acao: string;
  description?: string;
  time?: string;
}


/**
 * Define o formato do contexto ShapeContext.
 * - Gerencia formas geométricas (`availableShapes` e `activeShapes`).
 * - Controla pontos ativos no mapa (`activePoints`).
 * - Armazena ações únicas relacionadas aos pontos (`uniqueActions`).
 * - Permite adicionar, remover e selecionar formas e pontos.
 */
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
  activePoints: ActivePoint[];
  addPoints: (points: ActivePoint[]) => void;
  removePoints: (action: string) => void;
};

const ShapeContext = createContext<ShapeContextType | undefined>(undefined);



/**
 * Componente `ShapeProvider` que fornece o contexto para gerenciar dados geoespaciais e pontos ativos.
 * - Carrega formas geométricas e ações únicas no início.
 * - Exponibiliza funções para manipular esses dados.
 * @param children - Componentes filhos que terão acesso ao contexto.
 */
export const ShapeProvider =  ({ children }: { children: ReactNode }) => {

  const { geometryData, loading: geometryLoading } = useFetchGeometryData();

  const [availableShapes, setAvailableShapes] = useState<GeometryData[]>([]);
  const [activeShapes, setActiveShapes] = useState<GeometryData[]>([]);


  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);


  const [error, setError] = useState<string | null>(null);

  const { uniqueActions, loading: uniqueActionsLoading } = useFetchUniqueActions();
  const [ AlluniqueActions, setUniqueActions] = useState<UniqueAction[]>([]);
  const [activePoints, setActivePoints] = useState<ActivePoint[]>([]);

  const loading = geometryLoading || uniqueActionsLoading;

   /**
   * Busca formas geométricas no carregamento inicial usando `useFetchGeometryData`.
   * Atualiza o estado `availableShapes` e define `loading` como falso.
   */
  useEffect(() => {
    if (geometryData.length > 0) {
      setAvailableShapes(geometryData);
    }
  }, [geometryData]);



  /**
   * Busca ações únicas relacionadas aos pontos.
   * - Atualiza o estado `uniqueActions` com os dados retornados.
   */
  useEffect(() => {
      if(uniqueActions.length > 0) {
        setUniqueActions(uniqueActions);
      }
  }, []);


// SHAPES
  const addShape = (shape: GeometryData) => {
    setActiveShapes((prev) => [...prev, shape]);
  };
  const removeShape = (shapeId: string) => {
    setActiveShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
  };


// POINTS
  const addPoints = (points: ActivePoint[]) => {
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



/**
 * Hook para consumir o contexto `ShapeContext`.
 * Certifica-se de que o contexto está sendo usado dentro de um `ShapeProvider`.
 * @throws Erro se usado fora do `ShapeProvider`.
 */
export const useShapeContext = () => {
  const context = useContext(ShapeContext);
  if (!context) throw new Error("useShapeContext must be used within a ShapeProvider");
  return context
}