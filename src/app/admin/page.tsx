'use client'

import { createPost } from "@/app/_actions/actions";
import useAdminCheck from "@/hooks/use-admincheck"; // Certifique-se de ajustar o caminho conforme necessário

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
      <div className="bg-gray-100 p-8 rounded-md shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Adicionar um novo Shape</h1>
        <form action={createPost} className="flex flex-col gap-4">
          <label htmlFor="type" className="font-medium">Tipo do Geojson</label>
          <input
            type="text"
            name="type"
            placeholder="Padrão 'FeatureCollection'"
            id="type"
            className="p-2 border rounded-md"
          />

          <label htmlFor="name" className="font-medium">Nome</label>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            id="name"
            className="p-2 border rounded-md"
          />

          <label htmlFor="size" className="font-medium">Tamanho</label>
          <input
            type="text"
            name="size"
            placeholder="Tamanho"
            id="size"
            className="p-2 border rounded-md"
          />

          <label htmlFor="color" className="font-medium">Cor</label>
          <input
            type="text"
            name="color"
            placeholder="Cor em inglês"
            id="color"
            className="p-2 border rounded-md"
          />

          <label htmlFor="features" className="font-medium">Features</label>
          <input
            type="text"
            name="features"
            placeholder="Enter features"
            id="features"
            className="p-2 border rounded-md"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md mt-4 hover:bg-blue-600"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}
