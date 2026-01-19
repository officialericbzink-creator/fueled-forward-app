import { ExpoConfig, ConfigContext } from "@expo/config"

import { version } from "./package.json"

/**
 * Use ts-node here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript
 */
require("ts-node/register")

// Your existing EAS project configuration
const EAS_PROJECT_ID = "f219f452-ee86-4e74-84b3-ecfcfdadbd17"
const PROJECT_SLUG = "fueled-forward-app"
const OWNER = "fueled-forward"

// Base app configuration
const APP_NAME = "Fueled Forward"
const BUNDLE_IDENTIFIER = "com.fueledforwardapp"
const PACKAGE_NAME = "com.fueledforwardapp"
const SCHEME = "fueled-forward-app"

// Get dynamic config based on environment
const getDynamicAppConfig = (environment: "development" | "preview" | "production") => {
  if (environment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      scheme: SCHEME,
    }
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      scheme: SCHEME,
    }
  }

  // development
  return {
    name: `${APP_NAME} Dev`,
    bundleIdentifier: BUNDLE_IDENTIFIER,
    packageName: PACKAGE_NAME,
    scheme: SCHEME,
  }
}

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? []

  // Get environment from APP_ENV or default to development
  const appEnv = (process.env.APP_ENV as "development" | "preview" | "production") || "development"

  console.log("⚙️ Building app for environment:", appEnv)

  const { name, bundleIdentifier, packageName, scheme } = getDynamicAppConfig(appEnv)

  return {
    ...config,
    name,
    version,
    slug: PROJECT_SLUG,
    scheme,
    owner: OWNER,
    ios: {
      ...config.ios,
      bundleIdentifier,
      supportsTablet: true,
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
          },
        ],
      },
    },
    android: {
      ...config.android,
      package: packageName,
    },
    plugins: [...existingPlugins, require("./plugins/withSplashScreen").withSplashScreen],
    extra: {
      ...config.extra,
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
  }
}
