'use client'

import { useState, useEffect } from "react"
import { Trash, ChevronDown, ChevronUp } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useShapeContext } from "@/Context/shapeContext"
import { deleteShapeAction } from "@/app/_actions/actions"
import DeleteConfirmModal from "@/components/ConfirmModal/deleteconfirmModal"
import { GeometryData } from "@/@types/geomtry"

export default function ExpandableControlShapes() {
  const { availableShapes, activeShapes, addShape, removeShape, loading, setAvailableShapes } = useShapeContext()
  const [selectedShapes, setSelectedShapes] = useState<string[]>(activeShapes.map(shape => shape.id))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [shapeToDelete, setShapeToDelete] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    setSelectedShapes(activeShapes.map((shape) => shape.id))
  }, [activeShapes])

  const handleCheckboxChange = (shapeId: string) => {
    if (selectedShapes.includes(shapeId)) {
      removeShape(shapeId)
      setSelectedShapes(selectedShapes.filter(id => id !== shapeId))
    } else {
      const selectedShape = availableShapes.find((shape) => shape.id === shapeId)
      if (selectedShape) {
        addShape(selectedShape)
        setSelectedShapes([...selectedShapes, shapeId])
      }
    }
  }

  const handleDeleteClick = (shapeId: string) => {
    setShapeToDelete(shapeId)
    setIsModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (shapeToDelete) {
      try {
        await deleteShapeAction(shapeToDelete)
        setAvailableShapes((prevShapes: GeometryData[]) => prevShapes.filter(shape => shape.id !== shapeToDelete))
        setSelectedShapes(selectedShapes.filter(id => id !== shapeToDelete))
      } catch (error) {
        console.error("Erro ao deletar o shape:", error)
      } finally {
        setIsModalOpen(false)
        setShapeToDelete(null)
      }
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="w-full max-w-sm mx-auto">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="border rounded-lg shadow-sm bg-card"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-6">
            <h2 className="text-lg font-semibold">Shapes</h2>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-6 pt-0 space-y-4">
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
                className="w-4 h-4 text-red-500 cursor-pointer ml-auto"
              />
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
  )
}