'use client';

import { useState, useEffect } from "react";
import { Trash, ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useShapeContext } from "@/Context/shapeContext";
import { deleteShapeAction, GetPointsByAction } from "@/app/_actions/actions";
import DeleteConfirmModal from "@/components/ConfirmModal/deleteconfirmModal";
import { GeometryData } from "@/@types/geomtry";

export default function ExpandableControlShapes() {
  const {
    availableShapes,
    activeShapes,
    addShape,
    removeShape,
    loading,
    setAvailableShapes,
    uniqueActions,
    addPoints,
    removePoints,
  } = useShapeContext();

  const [selectedShapes, setSelectedShapes] = useState<string[]>(activeShapes.map((shape) => shape.id));
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shapeToDelete, setShapeToDelete] = useState<string | null>(null);
  const [isOpenShapes, setIsOpenShapes] = useState(true);
  const [isOpenActions, setIsOpenActions] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);


  useEffect(() => {
    setSelectedShapes(activeShapes.map((shape) => shape.id));
  }, [activeShapes]);

  

  const handleShapeCheckboxChange = (shapeId: string) => {
    if (selectedShapes.includes(shapeId)) {
      removeShape(shapeId);
      setSelectedShapes(selectedShapes.filter((id) => id !== shapeId));
    } else {
      const selectedShape = availableShapes.find((shape) => shape.id === shapeId);
      if (selectedShape) {
        addShape(selectedShape);
        setSelectedShapes([...selectedShapes, shapeId]);
      }
    }
  };

  const handleActionCheckboxChange = async (action: string) => {
    if (loadingAction) return; // Impede cliques repetidos enquanto carrega
    setLoadingAction(action);
  
    try {
      if (selectedActions.includes(action)) {
        // Remove pontos relacionados à ação desmarcada
        removePoints(action);
        setSelectedActions((prev) => prev.filter((a) => a !== action));
      } else {
        // Busca e adiciona pontos relacionados à ação marcada
        const points = await GetPointsByAction(action);
        addPoints(points);
        setSelectedActions((prev) => [...prev, action]);
      }
    } catch (error) {
      console.error(`Erro ao buscar pontos para a ação "${action}":`, error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteClick = (shapeId: string) => {
    setShapeToDelete(shapeId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (shapeToDelete) {
      try {
        await deleteShapeAction(shapeToDelete);
        setAvailableShapes((prevShapes: GeometryData[]) => prevShapes.filter((shape) => shape.id !== shapeToDelete));
        setSelectedShapes(selectedShapes.filter((id) => id !== shapeToDelete));
      } catch (error) {
        console.error("Erro ao deletar o shape:", error);
      } finally {
        setIsModalOpen(false);
        setShapeToDelete(null);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Shapes Section */}
      <Collapsible
        open={isOpenShapes}
        onOpenChange={setIsOpenShapes}
        className="border rounded-lg shadow-sm bg-card mb-4"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-6">
            <h2 className="text-lg font-semibold">Shapes</h2>
            {isOpenShapes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-6 pt-0 space-y-4">
          {availableShapes.map((shape) => (
            <div key={shape.id} className="flex items-center space-x-2">
              <Checkbox
                id={shape.id}
                checked={selectedShapes.includes(shape.id)}
                onCheckedChange={() => handleShapeCheckboxChange(shape.id)}
              />
              <Label htmlFor={shape.id}>{shape.name}</Label>
              <Trash
                onClick={() => handleDeleteClick(shape.id)}
                className="w-4 h-4 text-red-500 cursor-pointer ml-auto"
              />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Actions Section */}
      <Collapsible
        open={isOpenActions}
        onOpenChange={setIsOpenActions}
        className="border rounded-lg shadow-sm bg-card"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-6">
            <h2 className="text-lg font-semibold">Ações</h2>
            {isOpenActions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-6 pt-0 space-y-4">
          {uniqueActions.map(({ acao, count }) => (
            <div key={acao} className="flex items-center space-x-2">
              <Checkbox
                id={acao}
                checked={selectedActions.includes(acao)}
                disabled={loadingAction === acao} // Desativa o checkbox enquanto carrega
                onCheckedChange={() => handleActionCheckboxChange(acao)}
              />
              <Label htmlFor={acao}>{`${acao} (${count})`}</Label>
              {loadingAction === acao && <span className="ml-2 text-sm text-gray-500">Carregando...</span>}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {isModalOpen && (
        <DeleteConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
