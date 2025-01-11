'use client'

import { useState } from "react"
import { DataList } from "../components/data-list"
import { AddDataForm } from "../components/add-data-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const columns = ["id", "area", "data", "tipo"]
const initialData = [
  { id: 1, area: "100 ha", data: "2023-01-01", tipo: "Corte raso" },
  { id: 2, area: "50 ha", data: "2023-02-15", tipo: "Degradação" },
]

export default function DesmatamentoPage() {
  const [data, setData] = useState(initialData)



  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Desmatamento</h1>
      

      <Card>
        <CardHeader>
          <CardTitle>Dados de Desmatamento</CardTitle>
        </CardHeader>
        <CardContent>
          <DataList data={data} columns={columns} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <AddDataForm onSubmit={AddDataForm} fields={columns.filter(c => c !== 'id')} />
        </CardContent>
      </Card>

      <Button>Importar dados Excel</Button>
    </div>
  )
}

