interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SERDAL_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}