import { defineConfig } from 'orval';

const orvalConfig = defineConfig({
    ticketplatform: {
        output: {
            mode: 'split',
            target: './packages/api-sdk/src/index.ts',
            schemas: './packages/api-sdk/src/model',
            baseUrl: 'http://localhost:4000',
            httpClient: 'axios',
            indexFiles: true,
            client: 'react-query',
            mock: true,
        },
        input: {
            target: './openapi.json',
        }
    }
});

export default orvalConfig;