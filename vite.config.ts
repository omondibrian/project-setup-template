import path from 'path'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'db',"**/logs/*","**/prisma/*"],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@Domain': path.resolve(__dirname, './src/domain'),
      '@Infranstructure': path.resolve(__dirname, './src/infrastructure'),
      '@Application': path.resolve(__dirname, './src/application'),
      '@Utils': path.resolve(__dirname, './src/utilities'),
      '@Web': path.resolve(__dirname, './src/web'),
    },
   
  },
  
})
