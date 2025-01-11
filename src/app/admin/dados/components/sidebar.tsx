import Link from "next/link"
import { Button } from "@/components/ui/button"

const categories = [
  "Desmatamento",
  "Fogo",
  "Propriedades",
  "Estradas",
  "Ações",
  "Areas"
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <nav>
          {categories.map((category) => (
            <Link key={category} href={`/admin/dados/${category.toLowerCase()}`} passHref>
              <Button variant="ghost" className="w-full justify-start mb-2">
                {category}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

