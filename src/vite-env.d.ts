/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  /** '1' in book builds (scripts/book/build-pdf.mjs): adds the /book/:courseId print page */
  readonly VITE_BOOK?: string
  /** '1' shows the play-money wallet and the market simulator (src/content/features.ts) */
  readonly VITE_SIMULATOR?: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
