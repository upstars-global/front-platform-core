## Configuration for Projects Using `front-platform-core`

To use `front-platform-core` as a Git dependency without precompiled JavaScript, make sure your project is correctly configured to resolve TypeScript and Vite aliases.

### Installation

Add the package to your dependencies (via Git):

```bash
  npm install myrepo/front-platform-core#v1.0.0
```

### tsconfig.json

Add the following settings to your `tsconfig.json` (or equivalent in a monorepo):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@core/*": ["../../node_modules/front-platform-core/src/*"]
    }
  },
  "references": [
    { "path": "../../node_modules/front-platform-core" }
  ]
}
```

**Important:**  
Do not include `node_modules/front-platform-core` in the `include` array.  
TypeScript will attempt to emit files into `node_modules`, which is not allowed and will result in errors.

### vite.config.ts

In your `vite.config.ts`, add the alias configuration:

```ts
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@core': fileURLToPath(new URL('../../node_modules/front-platform-core/src', import.meta.url))
    }
  }
});
```

**Note:**  
The relative path to `node_modules` in the configuration may vary depending on your project's folder structure. Adjust accordingly.
