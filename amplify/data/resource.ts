import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  InitialGeometry: a.model({
    PK: a.string(), // Primary Key
    SK: a.string(), // Sort Key
    type: a.string(),
    category: a.enum( ["Desmatamento", "Fogo", "Atividades", "Propriedades", "Outros"]),
    name: a.string(),
    color: a.string(),
    features: a.json(), // JSON para dados GeoJSON
    extra: a.json()
  }).authorization(allow => [allow.guest().to(["read", "create", "delete", "update"]), allow.owner().to(["read", "update", "delete", "create"])]),



  Areas: a.model({
    PK: a.string(), // Primary Key
    SK: a.string(), // Sort Key
    type: a.string().default("Areas"),
    name: a.string(),
    geometry: a.json(), // JSON para dados GeoJSON
    extra: a.json()
  }).authorization(allow => [allow.guest().to(["read", "create", "delete", "update"]), allow.owner().to(["read", "update", "delete", "create"])]),


  AcoesRDP: a.model({
    PK: a.string(),
    SK: a.string(),
    name: a.string(),
    latitude: a.float(),
    longitude: a.float(),
    elevation: a.float(),
    time: a.string(),
    description: a.string(),
    mes: a.string(),
    acao: a.string(),
    extra: a.json()

  }).authorization(allow => [allow.guest().to(["read", "create", "delete", "update"]), allow.owner().to(["read", "update", "delete", "create"])]),

  Fogo: a.model({
    PK: a.string(), // Primary Key
    SK: a.string(), // Sort Key
    type: a.string().default("Fogo"),
    area: a.float(),
    geometry: a.json(), // JSON para dados GeoJSON
    data: a.string(),
    extra: a.json()

  }).authorization(allow => [allow.guest().to(["read", "create", "delete", "update" ]), allow.owner().to(["read", "update", "delete", "create"])]),


  Desmatamento: a.model({
    PK: a.string(), // Primary Key
    SK: a.string(), // Sort Key
    type: a.string().default("Desmatamento"),
    data: a.string(),
    municipio: a.string(),
    cod_alerta: a.string(),
    fonte: a.string(),
    pressao: a.string(),
    area: a.float(),
    geometry: a.json(), // JSON para dados GeoJSON
    extra: a.json()

  }).authorization(allow => [allow.guest().to(["read", "create", "delete", "update" ]), allow.owner().to(["read", "update", "delete", "create"])]),


  Propriedades: a.model({
    PK: a.string(), // Primary Key
    SK: a.string(), // Sort Key
    type: a.string().default("Propriedades"),
    geometry: a.json(), // JSON para dados GeoJSON
    cod_imovel: a.string(),
    area: a.float(),
    nome: a.string(),
    municipio: a.string(),
    proprietario: a.string(),
    extra: a.json()

  }).authorization(allow => [allow.guest().to(["read", "create", "delete", "update" ]), allow.owner().to(["read", "update", "delete", "create"])]),




}).authorization(allow => [allow.guest().to(["read", "create", "delete", "update"]), allow.owner().to(["read", "update", "delete", "create"])])


export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
