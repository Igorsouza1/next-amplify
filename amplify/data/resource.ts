import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  GeoEntity: a.model({
    PK: a.string(),
    SK: a.string(),
    Geometry: a.json(),
    Name: a.string(),
    Type: a.string(),
    Features: a.json(),
    Municipio: a.string(),
    AreaHa: a.string(),
    DataDetec: a.string(),
    VPressao: a.string(),
    Cod_Imovel: a.string(),
    Num_Area: a.string(),
    DescSeg: a.string(),
    TipoPNV: a.string(),
  }).authorization(allow => [allow.guest().to(["read"]), allow.owner()]),
}).authorization(allow => [allow.guest().to(["read"]), allow.owner()]);

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
