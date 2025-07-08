import { defineConfig } from 'orval';

export default defineConfig({
  ticketApi: {
    output: {
      mode: 'split',
      target: 'packages/api-sdk/src/index.ts',
      schemas: 'packages/api-sdk/src/model',
      client: 'react-query',
      prettier: true,
      override: {
        mutator: {
          path: './packages/api-sdk/src/mutator-instance.ts',
          name: 'customInstance',
        },
      },
    },
    input: {
      target: './openapi.json',
    },
  },
});
