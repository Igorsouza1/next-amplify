"use server"

import { cookieBasedClient } from "@/utils/amplify-utils"
import { redirect } from "next/navigation"

export async function saveGeoJsonData(geoJsonData: any, fileName: string) {
  try {
    // Desestruturação dos dados específicos das features de acordo com o modelo GeoEntity
    const features = geoJsonData.features.map((feature: any) => {
      const { Municipio, AreaHa, DataDetec, VPressao, Cod_Imovel, Num_Area, DescSeg, TipoPNV } =
        feature.properties || {};

      return {
        PK: `GeoEntity#${fileName}`, // Chave de Partição, ajustada conforme necessário
        SK: `Feature#${Math.random().toString(36).slice(2, 11)}`, // Chave de Sort, para gerar um identificador único para cada feature
        Geometry: feature.geometry,
        Name: fileName,
        Type: geoJsonData.type,
        Features: feature, // Salvando a feature completa, caso precise ser acessada integralmente
        Municipio: Municipio || null,
        AreaHa: AreaHa || null,
        DataDetec: DataDetec || null,
        VPressao: VPressao || null,
        Cod_Imovel: Cod_Imovel || null,
        Num_Area: Num_Area || null,
        DescSeg: DescSeg || null,
        TipoPNV: TipoPNV || null,
      };
    });
    console.log('Dados a serem salvos:', features);
    // Salvar cada feature de forma independente no modelo GeoEntity
    const promises = features.map(async (featureData: any) => {
      await cookieBasedClient.models.GeoEntity.create(featureData);
    });

    await Promise.all(promises);
    console.log('Dados salvos com sucesso:', features);
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
  }
}


export async function getGeoEntities() {
    try {
      const { data: geoEntities } = await cookieBasedClient.models.GeoEntity.list({
        selectionSet: [
          'id',          // ID da entidade
          'Name',        // Nome do arquivo (ou identificação do GeoJSON)
          'Type',        // Tipo da entidade
          'Geometry',    // Geometria da entidade (caso precise ser renderizada no front-end)
          'Features',    // Lista de features associadas
          'Municipio',   // Campos específicos de propriedades
          'AreaHa',
          'DataDetec',
          'VPressao',
          'Cod_Imovel',
          'Num_Area',
          'DescSeg',
          'TipoPNV'
        ],
        authMode: 'userPool'
      });
  
      // Log para verificar o formato dos dados recebidos
      console.log('GeoEntities:', geoEntities);
  
      return geoEntities;
    } catch (error) {
      console.error('Erro ao obter os dados de GeoEntities:', error);
      return null;  // Retorna null em caso de erro para tratar no front-end
    }
  }


// export async function getInitialGeometry() {
//     try{
//     const {data: InitialGeometry} = await cookieBasedClient.models.InitialGeometry.list({
//         selectionSet: ['id' , 'name', 'features', 'size', 'color'],
//         authMode: 'userPool'
//       }); 
//     //   console.log('InitialGeometry', InitialGeometry)
//       return InitialGeometry;
//     } catch (error) {
//         console.error('Error getting initial geometry', error)
//     }
// }