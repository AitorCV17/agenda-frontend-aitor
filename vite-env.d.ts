interface ImportMetaEnv {
    VITE_GOOGLE_MAPS_API_KEY: string | undefined;
    readonly VITE_API_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  