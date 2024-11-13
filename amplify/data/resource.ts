import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  InitialGeometry: a.model({
    PK: a.string(), // Primary Key
    SK: a.string(), // Sort Key
    type: a.string(),
    category: a.enum( ["Desmatamento", "Fogo", "Ações", "Propriedades"]),
    name: a.string(),
    color: a.string(),
    features: a.json(), // JSON para dados GeoJSON
  }).authorization(allow => [allow.guest().to(["read"]), allow.owner()]),
}).authorization(allow => [allow.guest().to(["read"]), allow.owner()])

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

