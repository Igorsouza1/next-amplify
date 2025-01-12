"use client";

import { useState } from "react";
import { DataList } from "../components/data-list";
import { AddDataForm } from "../components/add-data-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Data {
  id: number;
  area: string;
  data: string;
  tipo: string;
}

const columns: Array<keyof Data> = ["id", "area", "data", "tipo"];
const initialData: Data[] = [
  { id: 1, area: "100 ha", data: "2023-01-01", tipo: "Corte raso" },
  { id: 2, area: "50 ha", data: "2023-02-15", tipo: "Degradação" },
];

export default function DesmatamentoPage() {
  const [data, setData] = useState<Data[]>(initialData);

  // Função para lidar com o envio do formulário
  const handleAddData = (newData: Omit<Data, "id">) => {
    // Gera um novo ID e adiciona os dados à lista existente
    const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    const newDataWithId = { ...newData, id: newId };
    setData((prevData) => [...prevData, newDataWithId]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Desmatamento</h1>

      {/* Lista de dados */}
      <Card>
        <CardHeader>
          <CardTitle>Dados de Desmatamento</CardTitle>
        </CardHeader>
        <CardContent>
          <DataList data={data} columns={columns} />
        </CardContent>
      </Card>

      {/* Formulário para adicionar dados */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <AddDataForm
            onSubmit={handleAddData}
            fields={columns.filter((c) => c !== "id")}
          />
        </CardContent>
      </Card>

      {/* Botão para importar dados */}
      <Button>Importar dados Excel</Button>
    </div>
  );
}
