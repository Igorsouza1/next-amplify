'use client';

import { useState, useEffect } from 'react';
import { X, Pencil, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Feature } from '@/@types/geomtry';
import { updateShapeAction } from '@/app/_actions/actions'; // Certifique-se de importar corretamente
import { useShapeContext } from '@/Context/shapeContext'; // Para acessar os dados do contexto

type BarraLateralProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RightSidebar({ isOpen, onClose }: BarraLateralProps) {
  const { activeShapes, selectedFeature, setSelectedFeature } = useShapeContext();
  const [atributos, setAtributos] = useState<Feature['properties']>(selectedFeature?.properties || {});
  const [editando, setEditando] = useState(false);
  const { toast } = useToast();

  // Atualiza os atributos sempre que a feature selecionada mudar
  useEffect(() => {
    setAtributos(selectedFeature?.properties || {});
  }, [selectedFeature]);

  const handleEdit = () => setEditando(true);

  const handleSave = async () => {
    try {
      if (!selectedFeature || !selectedFeature.id) {
        throw new Error('Nenhuma feature selecionada ou feature sem ID.');
      }

      // Encontra o shape ativo associado à feature selecionada
      const activeShape = activeShapes.find((shape) =>
        shape.features.some((feature) => feature.id === selectedFeature.id)
      );

      if (!activeShape?.id) {
        throw new Error('ID do shape ativo não encontrado.');
      }

      // Atualiza cada campo alterado individualmente no backend
      for (const [key, value] of Object.entries(atributos)) {
        await updateShapeAction(activeShape.id, {
          id: selectedFeature.id, // ID da feature a ser atualizada
          field: key, // Nome do campo atualizado
          value, // Novo valor
        });
      }

      toast({
        title: 'Edição realizada com sucesso',
        description: 'Os dados foram atualizados no banco.',
      });

      // Finaliza a edição
      setEditando(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível atualizar os dados. Tente novamente.',
        variant: 'destructive',
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
          {/* Exibição das propriedades */}
          {Object.entries(atributos || {}).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key}>{key}</Label>
              {editando ? (
                <Input
                  id={key}
                  value={value?.toString() || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600">{value?.toString() || 'N/A'}</p>
              )}
            </div>
          ))}
          {/* Botões de ação */}
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
