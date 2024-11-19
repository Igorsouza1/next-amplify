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
      console.log(InitialGeometry.map((item: any) => item.id))
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



  export async function updateFeatureProperties(
    shapeId: string,
    featureId: string,
    updatedFeature: Record<string, any>
  ) {
    console.log("Iniciando atualização de feature no DynamoDB...");
    console.log(`Shape ID recebido: ${shapeId}`);
    console.log(`Feature ID recebido: ${featureId}`);
    console.log("Nova feature recebida:", updatedFeature);
  
    try {
      console.log("Buscando shape no banco de dados...");
      const { data: shape, errors: shapeErrors } = await cookieBasedClient.models.InitialGeometry.get({
        id: shapeId,
      });
  
      if (shapeErrors || !shape) {
        throw new Error("Shape não encontrado no banco de dados.");
      }
  
      console.log("Shape encontrado:", shape);
  
      // Verificar se o campo 'features' existe e é válido
      if (!shape.features || typeof shape.features !== "string") {
        throw new Error("O campo 'features' do shape é inválido ou está ausente.");
      }
  
      // Desserializar o campo 'features'
      let features: any[];
      try {
        const parsed = JSON.parse(shape.features);
        features = parsed.features || [];
      } catch (err) {
        throw new Error("Falha ao analisar o JSON do campo 'features'.");
      }
  
      console.log("Features desserializadas:", features);
  
      // Localizar a feature pelo ID
      const featureIndex = features.findIndex((feature) => feature.id === featureId);
      if (featureIndex === -1) {
        throw new Error(`Feature com ID ${featureId} não encontrada.`);
      }
  
      console.log("Feature encontrada antes da atualização:", features[featureIndex]);
  
      // Atualizar a feature completa
      features[featureIndex] = {
        ...features[featureIndex], // Mantém os dados antigos se necessário
        ...updatedFeature,        // Sobrescreve com os dados atualizados
      };
  
      console.log("Feature atualizada:", features[featureIndex]);
  
      // Serializar novamente o campo 'features'
      const updatedFeatures = JSON.stringify({ features });
  
      console.log("Features atualizadas prontas para salvar:", updatedFeatures);
  
      // Atualizar o shape no banco de dados
      const updatedShape = {
        ...shape,
        features: updatedFeatures,
      };
  
      console.log("Shape atualizado pronto para salvar:", updatedShape);
  
      // Primeiro, remova o item existente
      console.log("Removendo shape antigo...");
      await cookieBasedClient.models.InitialGeometry.delete({ id: shapeId });
  
      // Reinsira o item atualizado
      console.log("Reinserindo shape atualizado...");
      const { data: savedShape, errors: saveErrors } = await cookieBasedClient.models.InitialGeometry.create(
        updatedShape
      );
  
      if (saveErrors) {
        console.error("Erros ao salvar no banco:", saveErrors);
        throw new Error("Erro ao salvar as alterações no banco.");
      }
  
      console.log("Shape salvo com sucesso:", savedShape);
      return savedShape;
    } catch (error) {
      console.error("Erro ao executar updateFeatureProperties:", error);
      throw new Error("Erro ao atualizar as propriedades da feature.");
    }
  }
  