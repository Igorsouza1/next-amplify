'use client'

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useShapeContext } from "@/Context/shapeContext";
import { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { deleteShapeAction } from "@/app/_actions/actions";
import DeleteConfirmModal from "@/components/ConfirmModal/deleteconfirmModal";
import { GeometryData } from "@/@types/geomtry";

const ControlShapes = () => {
  const { availableShapes, activeShapes, addShape, removeShape, loading, setAvailableShapes } = useShapeContext();
  const [selectedShapes, setSelectedShapes] = useState<string[]>(activeShapes.map(shape => shape.id));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shapeToDelete, setShapeToDelete] = useState<string | null>(null);

  useEffect(() => {
    setSelectedShapes(activeShapes.map((shape) => shape.id));
  }, [activeShapes]);

  const handleCheckboxChange = (shapeId: string) => {
    if (selectedShapes.includes(shapeId)) {
      removeShape(shapeId);
      setSelectedShapes(selectedShapes.filter(id => id !== shapeId));
    } else {
      const selectedShape = availableShapes.find((shape) => shape.id === shapeId);
      if (selectedShape) {
        addShape(selectedShape);
        setSelectedShapes([...selectedShapes, shapeId]);
      }
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
        setAvailableShapes((prevShapes: GeometryData[]) => prevShapes.filter(shape => shape.id !== shapeToDelete));
        setSelectedShapes(selectedShapes.filter(id => id !== shapeToDelete));
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
      <div className="border rounded-lg p-6 shadow-sm bg-card">
        <h2 className="text-lg font-semibold mb-4">Shapes</h2>
        <div className="space-y-4">
          {availableShapes.map((shape) => (
            <div key={shape.id} className="flex items-center space-x-2">
              <Checkbox
                id={shape.id}
                checked={selectedShapes.includes(shape.id)}
                onCheckedChange={() => handleCheckboxChange(shape.id)}
              />
              <Label htmlFor={shape.id}>{shape.name}</Label>
              <Trash
                onClick={() => handleDeleteClick(shape.id)}
                className="w-4 h-4 text-red-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmação */}
      {isModalOpen && (
        <DeleteConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default ControlShapes;
