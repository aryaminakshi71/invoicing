# Invoicing PostCSS Config Fix

## Issue

The `postcss.config.js` file was using CommonJS syntax (`module.exports`) but the project has `"type": "module"` in `package.json`, which would cause the same error as Projects:

```
ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension
```

## Solution

Renamed `postcss.config.js` to `postcss.config.cjs` to explicitly mark it as a CommonJS module.

## Note

The project uses Tailwind CSS v4 with the Vite plugin (`@tailwindcss/vite`), and the Vite config has `postcss: false` which should disable PostCSS. However, the PostCSS config file is kept for:
- Legacy compatibility
- Other tools that might use it
- Future PostCSS plugins if needed

The `.cjs` extension tells Node.js to treat it as CommonJS even in an ESM project.
