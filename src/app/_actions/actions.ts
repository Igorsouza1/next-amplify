"use server";

import { cookieBasedClient } from "@/utils/amplify-utils";
import { redirect } from "next/navigation";



type CategoryType = "Desmatamento" | "Fogo" | "Atividades" | "Propriedades" | "Outros";

const categoryCounters: { [key in CategoryType]?: number } = {}; // Mudei de let para const

// Função para obter o próximo ID sequencial para uma categoria específica
function getNextSequentialId(category: CategoryType): string {
    if (!categoryCounters[category]) {
        // Inicializa o contador para a categoria se ainda não existir
        categoryCounters[category] = 1;
    } else {
        // Incrementa o contador para a categoria
        categoryCounters[category]++;
    }
    // Retorna o ID com padding opcional (ex.: "0001") para manter consistência
    return categoryCounters[category]!.toString().padStart(4, '0');
}

export async function createPost(formData: FormData) {
    try {
        const category = formData.get('category')?.toString() as CategoryType;
        const validCategories = ["Desmatamento", "Fogo", "Atividades", "Propriedades", "Outros"];
        if (!validCategories.includes(category)) throw new Error(`Invalid category: ${category}`);
        
        const type = formData.get('type')?.toString() || '';
        const name = formData.get('name')?.toString() || '';
        const color = formData.get('color')?.toString() || '';
        const features = JSON.stringify(
            formData.get('features') ? JSON.parse(formData.get('features') as string) : {}
        );

        const PK = `CATEGORY#${category}`;
        const SK = `category#${getNextSequentialId(category)}`;
        
        const { data, errors } = await cookieBasedClient.models.InitialGeometry.create({
            PK,
            SK,
            category,
            type,
            name,
            color,
            features
        });

        if (errors) {
            console.error('Error details:', errors);
        } else {
            console.log('Data created successfully:', data);
        }
    } catch (error) {
        console.error('Failed to create post:', error);
    }
}




// PEGAR AS GEOMETRIAS INICIAIS
export async function getInitialGeometry() {
    try{
    const {data: InitialGeometry} = await cookieBasedClient.models.InitialGeometry.list({
        selectionSet: ['id' , 'name', 'features', 'color'],
        authMode: 'userPool'
      }); 
    // console.log('InitialGeometry', InitialGeometry)
      return InitialGeometry;
    } catch (error) {
        console.error('Error getting initial geometry', error)
    }
}




export async function deleteShapeAction(id: string) {
    try {
  
      // Execução da operação de exclusão
      const { data, errors } = await cookieBasedClient.models.InitialGeometry.delete({
        id,
      });
  
      if (errors) {
        console.error("Erro ao excluir o item:", errors);
        throw new Error("Erro ao excluir o item.");
      }
  
      console.log("Item excluído com sucesso:", data);
      return data;
    } catch (error) {
      console.error("Erro ao executar deleteShapeAction:", error);
      throw new Error("Erro ao executar deleteShapeAction.");
    }
  }