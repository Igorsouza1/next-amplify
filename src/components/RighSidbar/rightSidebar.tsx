'use client';

import { useState, useEffect } from 'react';
import { X, Pencil, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

type BarraLateralProps = {
  isOpen: boolean;
  onClose: () => void;
  properties: Record<string, string | number>;
};
  
  export default function RighSidbar({ isOpen, onClose, properties }: BarraLateralProps) {
    // O estado interno inicializa com as propriedades recebidas
    const [atributos, setAtributos] = useState(properties || {});
    const [editando, setEditando] = useState(false);
    const { toast } = useToast();
  
    useEffect(() => {
      setAtributos(properties);
    }, [properties]);
  
    const handleEdit = () => setEditando(true);
  
    const handleSave = () => {
      setEditando(false);
      toast({
        title: 'Edição realizada com sucesso',
        description: 'Os dados foram atualizados.',
      });
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
            {Object.entries(atributos).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key}>{key}</Label>
                {editando ? (
                  <Input
                    id={key}
                    value={value.toString()}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{value}</p>
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
  