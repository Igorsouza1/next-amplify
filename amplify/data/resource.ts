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
  }).authorization(allow => [allow.guest().to(["read", "create", "delete", "update"]), allow.owner().to(["read", "update", "delete", "create"])]),
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

