import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Desmatamento", "Fogo", "Propriedades", "Estradas", "Ações", "Areas"].map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Resumo das informações de {category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

