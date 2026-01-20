/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_SITE_URL: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
