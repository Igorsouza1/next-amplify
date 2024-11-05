// src/components/forms/AddShapeForm.tsx
'use client';

// import { createPost } from "@/app/_actions/actions";

import useAdminCheck from "@/hooks/useAdminCheck"; // Certifique-se de ajustar o caminho conforme necessário
import DragandDrop from "./geojsonDragAndDrop";

export function FormGeojson() {
  const isAdmin = useAdminCheck();

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Acesso negado. Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }


  return (
      <DragandDrop />
  );
}

export default FormGeojson;
