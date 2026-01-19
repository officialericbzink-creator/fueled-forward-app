const Config = {
  API_URL: process.env.EXPO_PUBLIC_API_URL as string,
  AUTH_SITE_URL: process.env.EXPO_PUBLIC_AUTH_SITE_URL as string,
  PASSWORD_RESET_URL: process.env.EXPO_PUBLIC_PASSWORD_RESET_URL as string,
  STRAPI_URL: process.env.EXPO_PUBLIC_STRAPI_URL as string,
  STRAPI_TOKEN: process.env.EXPO_PUBLIC_STRAPI_TOKEN as string,
} as const

// Validation - ensure all required env vars are present
const requiredEnvVars = [
  "API_URL",
  "AUTH_SITE_URL",
  "PASSWORD_RESET_URL",
  "STRAPI_URL",
  "STRAPI_TOKEN",
] as const

for (const key of requiredEnvVars) {
  if (!Config[key]) {
    throw new Error(`Missing required environment variable: EXPO_PUBLIC_${key}`)
  }
}

export default Config
