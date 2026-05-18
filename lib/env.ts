import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NOTION_TOKEN: z.string().min(1).optional(),
    NOTION_DATABASE_ID: z.string().min(1).optional(),
  },
  client: {
    // NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})
