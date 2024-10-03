'use client'

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useShapeContext } from "@/Context/shapeContext"; // Importando o contexto de shapes
import { useState } from "react";

const ControlShapes = () => {
  const { availableShapes, activeShapes, addShape, removeShape } = useShapeContext();
  const [selectedShapes, setSelectedShapes] = useState<string[]>(activeShapes.map(shape => shape.id));

  const handleCheckboxChange = (shapeId: string) => {
    if (selectedShapes.includes(shapeId)) {
      // Se o shape já está selecionado, remover
      removeShape(shapeId);
      setSelectedShapes(selectedShapes.filter(id => id !== shapeId));
    } else {
      // Se o shape não está selecionado, adicionar
      const selectedShape = availableShapes.find((shape) => shape.id === shapeId);
      if (selectedShape) {
        addShape(selectedShape);
        setSelectedShapes([...selectedShapes, shapeId]);
      }
    }
  };

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlShapes;
