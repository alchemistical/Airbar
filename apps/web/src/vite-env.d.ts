/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly DEV: boolean
  readonly MODE: string
  readonly PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}