import { defineConfig } from '@hey-api/openapi-ts'
import { defaultPlugins } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://127.0.0.1:8000/openapi.json',
  output: 'src/client',
  plugins: [
    ...defaultPlugins,
    '@hey-api/client-fetch',
    {
      dates: true,
      name: '@hey-api/transformers',
    },
  ],
})
