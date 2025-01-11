'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddDataFormProps {
  onSubmit: (data: any) => void
  fields: string[]
}

export function AddDataForm({ onSubmit, fields }: AddDataFormProps) {
  const [formData, setFormData] = useState({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field}>
          <Label htmlFor={field}>{field}</Label>
          <Input
            id={field}
            value={formData[field] || ""}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          />
        </div>
      ))}
      <Button type="submit">Adicionar Dados</Button>
    </form>
  )
}

