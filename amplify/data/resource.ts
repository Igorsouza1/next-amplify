import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    comments: a.hasMany('Comment', 'postId'),  // 'postId' é a chave estrangeira no modelo Comment
    owner: a.string().authorization(allow => [allow.owner().to(['read', 'delete'])]),
  }).authorization(allow => [allow.publicApiKey().to(["read"]), allow.owner()]),

  Comment: a.model({
    postId: a.string().required(),
    content: a.string().required(),
    post: a.belongsTo('Post', 'postId'),  // 'postId' é a chave estrangeira
    owner: a.string().authorization(allow => [allow.owner().to(['read', 'delete'])]),
  }),

  InitialGeometry: a.model({
    type: a.string(),
    name: a.string(),
    size: a.string(),
    crs: a.string(),
    color: a.string(),
    geometry: a.json(),
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

