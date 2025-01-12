"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Data {
  id: number;
  area: string;
  data: string;
  tipo: string;
}

interface AddDataFormProps {
  onSubmit: (data: Data) => void;
  fields: Array<keyof Data>;
}

export function AddDataForm({ onSubmit, fields }: AddDataFormProps) {
  // Definimos um estado inicial vazio e garantimos o tipo do estado
  const [formData, setFormData] = useState<Partial<Data>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Valida que todos os campos necessários estão preenchidos
    if (fields.some((field) => !formData[field])) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Envia os dados e reseta o formulário
    onSubmit(formData as Data);
    setFormData({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field}>
          <Label htmlFor={field.toString()}>{field}</Label>
          <Input
            id={field.toString()}
            value={formData[field] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
          />
        </div>
      ))}
      <Button type="submit">Adicionar Dados</Button>
    </form>
  );
}
