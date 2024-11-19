'use client';

import { useState, useEffect } from 'react';
import { X, Pencil, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Feature } from '@/@types/geomtry';
import { updatePost } from '@/app/_actions/actions'; // Certifique-se de importar corretamente
import { useShapeContext } from '@/Context/shapeContext'; // Para acessar os dados do contexto

type BarraLateralProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RighSidbar({ isOpen, onClose }: BarraLateralProps) {
  const { activeShapes, selectedFeature, setSelectedFeature } = useShapeContext();
  const [atributos, setAtributos] = useState<Feature["properties"]>(selectedFeature || {});
  const [editando, setEditando] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setAtributos(selectedFeature || {});
  }, [selectedFeature]);

  const handleEdit = () => setEditando(true);

  const handleSave = async () => {
    try {
      if (!selectedFeature) {
        throw new Error("Nenhuma feature selecionada.");
      }
  
      // Encontra o shape ativo associado à feature selecionada
      const activeShape = activeShapes.find((shape) =>
        shape.features.some((feature) => feature.properties === selectedFeature)
      );
  
      if (!activeShape?.id) {
        throw new Error("ID do shape ativo não encontrado.");
      }
  
      // Obtém o ID único da feature a ser atualizada
      const featureId = activeShape.features.find(
        (feature: any) => feature.properties === selectedFeature
      )?.id;
  
      if (!featureId) {
        throw new Error("ID da feature não encontrado.");
      }
  
      // Atualiza os dados no DynamoDB
      await updatePost(activeShape.id, atributos, featureId);
  
      setEditando(false);
      toast({
        title: "Edição realizada com sucesso",
        description: "Os dados foram atualizados no banco.",
      });
  
      // Limpa a seleção
      setSelectedFeature(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  
  const handleChange = (key: string, value: string) => {
    setAtributos((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Informações do Item</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {Object.entries(atributos || {}).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key}>{key}</Label>
              {editando ? (
                <Input
                  id={key}
                  value={value?.toString() || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600">{value?.toString() || "N/A"}</p>
              )}
            </div>
          ))}
          {editando ? (
            <Button onClick={handleSave} className="w-full">
              <Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
          ) : (
            <Button onClick={handleEdit} className="w-full">
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
