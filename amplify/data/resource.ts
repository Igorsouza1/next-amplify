import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  InitialGeometry: a.model({
    type: a.string(),
    name: a.string(),
    size: a.string(),
    crs: a.string(),
    color: a.string(),
    features: a.json(),
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

