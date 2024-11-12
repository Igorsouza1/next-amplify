'use client'

import { createPost } from "@/app/_actions/actions";
import DragAndDrop from "@/components/dragAndDrop/dragAndDrop";
import { Sidebar } from "@/components/sidebar/sidebar";
import useAdminCheck from "@/hooks/useAdminCheck"; // Certifique-se de ajustar o caminho conforme necessário

export default function Add() {
  const isAdmin = useAdminCheck();

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Acesso negado. Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Sidebar />
      <DragAndDrop />
    </div>
  );
}
