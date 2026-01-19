import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react"
import { Linking, Platform } from "react-native"
import Purchases, { LOG_LEVEL, CustomerInfo, PurchasesPackage } from "react-native-purchases"

import { useAuth } from "./AuthContext"

// Subscription status types
export type SubscriptionStatus = "active" | "trial" | "expired" | "none"
export type PlanType = "monthly" | "yearly"

// Subscription data returned to consumers
export interface SubscriptionData {
  status: SubscriptionStatus
  planName: string | null
  price: string | null
  nextBillingDate: string | null
  trialDaysRemaining: number | null
  expirationDate: string | null
  isSubscribed: boolean
}

// Context type
export type InAppSubscriptionContextType = {
  // Subscription state
  subscriptionData: SubscriptionData
  isLoading: boolean
  isInitialized: boolean
  error: Error | null

  // Actions
  purchasePlan: (planType: PlanType) => Promise<{ success: boolean; error?: string }>
  restorePurchases: () => Promise<{ success: boolean; error?: string }>
  manageSubscription: () => void
  refreshSubscriptionStatus: () => Promise<void>
  availablePackages: OfferingPackage[] // NEW
  isLoadingOfferings: boolean
}

export interface OfferingPackage {
  identifier: string
  planType: PlanType
  price: string // Formatted price like "$12.99"
  pricePerMonth: string // For annual: "$7.50/mo"
  product: {
    identifier: string
    title: string
    description: string
  }
}

const InAppSubscriptionContext = createContext<InAppSubscriptionContextType | null>(null)

export interface InAppSubscriptionProviderProps {}

export const InAppSubscriptionProvider: FC<PropsWithChildren<InAppSubscriptionProviderProps>> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth()

  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [availablePackages, setAvailablePackages] = useState<OfferingPackage[]>([])
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    status: "none",
    planName: null,
    price: null,
    nextBillingDate: null,
    trialDaysRemaining: null,
    expirationDate: null,
    isSubscribed: false,
  })

  // Initialize RevenueCat SDK
  useEffect(() => {
    const initializeRevenueCat = async () => {
      // Only initialize if user is authenticated and we haven't initialized yet
      if (!isAuthenticated || !user?.id || isInitialized) {
        setIsLoading(false)
        return
      }
      if (!__DEV__ && process.env.EXPO_PUBLIC_USE_TEST_STORE === "true") {
        console.error("🚨 CRITICAL: Test Store is being used in production build!")
        console.error("🚨 This will cause app rejection. Update environment variables.")

        // Optionally throw an error to prevent app from running
        throw new Error(
          "Test Store API key detected in production. " +
            "Update EXPO_PUBLIC_USE_TEST_STORE to false and provide real API keys.",
        )
      }

      try {
        console.log("🔐 Initializing RevenueCat for user:", user.id)

        // STUB: Check for dev bypass
        if (__DEV__ && process.env.EXPO_PUBLIC_BYPASS_PAYWALL === "true") {
          console.log("⚠️ DEV MODE: Bypassing RevenueCat initialization")
          setIsInitialized(true)
          setIsLoading(false)
          setSubscriptionData({
            status: "active",
            planName: "Dev Bypass - Annual Plan",
            price: "$0.00/year",
            nextBillingDate: "Never (Dev Mode)",
            trialDaysRemaining: null,
            expirationDate: null,
            isSubscribed: true,
          })
          return
        }

        // Set log level
        Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO)

        // Get API keys from environment
        const appleApiKey = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY
        const googleApiKey = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY

        if (!appleApiKey && !googleApiKey) {
          throw new Error("RevenueCat API keys not configured")
        }

        // Configure SDK with user ID (never anonymous)
        if (Platform.OS === "ios" && appleApiKey) {
          Purchases.configure({
            apiKey: appleApiKey,
            appUserID: user.id, // CRITICAL: Use actual user ID
          })
        } else if (Platform.OS === "android" && googleApiKey) {
          Purchases.configure({
            apiKey: googleApiKey,
            appUserID: user.id, // CRITICAL: Use actual user ID
          })
        } else {
          throw new Error(`No API key for platform: ${Platform.OS}`)
        }

        console.log("✅ RevenueCat initialized successfully")
        setIsInitialized(true)

        // Fetch initial subscription status
        await fetchSubscriptionStatus()
      } catch (err) {
        console.error("❌ Failed to initialize RevenueCat:", err)
        setError(err instanceof Error ? err : new Error("Unknown initialization error"))
      } finally {
        setIsLoading(false)
      }
    }

    initializeRevenueCat()
  }, [isAuthenticated, user?.id, isInitialized])

  const parseCustomerInfo = (customerInfo: CustomerInfo): SubscriptionData => {
    // Check if user has any active entitlements
    const entitlements = customerInfo.entitlements.active
    const hasActiveEntitlement = Object.keys(entitlements).length > 0

    if (!hasActiveEntitlement) {
      return {
        status: "none",
        planName: null,
        price: null,
        nextBillingDate: null,
        trialDaysRemaining: null,
        expirationDate: null,
        isSubscribed: false,
      }
    }

    // Get the first active entitlement (assuming single entitlement for now)
    const entitlementKey = Object.keys(entitlements)[0]
    const entitlement = entitlements[entitlementKey]

    // Determine if in trial
    const isInTrial = entitlement.willRenew && entitlement.periodType === "TRIAL"

    // Calculate trial days remaining if applicable
    let trialDaysRemaining = null
    if (isInTrial && entitlement.expirationDate) {
      const expirationDate = new Date(entitlement.expirationDate)
      const now = new Date()
      const daysRemaining = Math.ceil(
        (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      )
      trialDaysRemaining = Math.max(0, daysRemaining)
    }

    // Format dates
    const formatDate = (dateString: string | null) => {
      if (!dateString) return null
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    return {
      status: isInTrial ? "trial" : "active",
      planName: entitlement.productIdentifier || null,
      price: null, // Will be set from offerings
      nextBillingDate: formatDate(entitlement.expirationDate),
      trialDaysRemaining,
      expirationDate: entitlement.willRenew ? null : formatDate(entitlement.expirationDate),
      isSubscribed: true,
    }
  }

  const identifyPlanType = (pkg: PurchasesPackage): PlanType | null => {
    const productId = pkg.product.identifier.toLowerCase()
    const packageType = pkg.packageType
    const identifier = pkg.identifier.toLowerCase()

    // Check package type first (most reliable)
    if (packageType === "MONTHLY") return "monthly"
    if (packageType === "ANNUAL") return "yearly"

    // Check RevenueCat standard identifiers
    if (identifier === "$rc_monthly") return "monthly"
    if (identifier === "$rc_annual") return "yearly"

    // Check product identifier patterns
    if (productId.includes("month")) return "monthly"
    if (productId.includes("year") || productId.includes("annual")) return "yearly"

    // For Test Store products
    if (productId === "monthly") return "monthly"
    if (productId === "yearly") return "yearly"

    return null
  }

  // Fetch subscription status from RevenueCat
  const fetchSubscriptionStatus = useCallback(async () => {
    if (!isInitialized) {
      console.log("⚠️ RC not initialized, skipping status fetch")
      return
    }

    try {
      setIsLoading(true)
      console.log("📊 Fetching subscription status...")

      // REAL RC CALL
      const customerInfo: CustomerInfo = await Purchases.getCustomerInfo()

      console.log("📦 CustomerInfo:", JSON.stringify(customerInfo, null, 2))

      // Parse subscription data from customerInfo
      const parsedData = parseCustomerInfo(customerInfo)

      setSubscriptionData(parsedData)
      console.log("✅ Subscription status updated:", parsedData)
    } catch (err) {
      console.error("❌ Failed to fetch subscription status:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch status"))
    } finally {
      setIsLoading(false)
    }
  }, [isInitialized])

  // Purchase a plan
  const purchasePlan = useCallback(
    async (planType: PlanType): Promise<{ success: boolean; error?: string }> => {
      if (!isInitialized) {
        return { success: false, error: "RevenueCat not initialized" }
      }

      try {
        setIsLoading(true)
        console.log(`💳 Purchasing ${planType} plan...`)

        // Fetch current offerings
        const offerings = await Purchases.getOfferings()
        console.log("📦 Offerings:", JSON.stringify(offerings, null, 2))

        if (!offerings.current) {
          throw new Error("No offerings available")
        }

        // Map planType to product identifier
        const productId = planType === "yearly" ? "yearly" : "monthly"

        // Find the package
        const packageToPurchase = offerings.current.availablePackages.find(
          (pkg) => pkg.product.identifier === productId,
        )

        if (!packageToPurchase) {
          throw new Error(`Package not found for ${planType}`)
        }

        console.log("🎁 Purchasing package:", packageToPurchase.identifier)

        // Make the purchase
        const { customerInfo } = await Purchases.purchasePackage(packageToPurchase)

        console.log("✅ Purchase successful:", JSON.stringify(customerInfo, null, 2))

        // Update subscription data
        const updatedData = parseCustomerInfo(customerInfo)
        setSubscriptionData(updatedData)

        return { success: true }
      } catch (err: any) {
        console.error("❌ Purchase failed:", err)

        // Handle user cancellation
        if (err.userCancelled) {
          return { success: false, error: "Purchase cancelled" }
        }

        const errorMessage = err.message || "Purchase failed"
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [isInitialized],
  )

  // Restore purchases
  const restorePurchases = useCallback(async (): Promise<{
    success: boolean
    error?: string
  }> => {
    if (!isInitialized) {
      return { success: false, error: "RevenueCat not initialized" }
    }

    try {
      setIsLoading(true)
      console.log("🔄 Restoring purchases...")

      // Call RC restore
      const customerInfo = await Purchases.restorePurchases()

      console.log("✅ Restore complete:", JSON.stringify(customerInfo, null, 2))

      // Update subscription data
      const updatedData = parseCustomerInfo(customerInfo)
      setSubscriptionData(updatedData)

      // Check if any active entitlements were found
      if (Object.keys(customerInfo.entitlements.active).length === 0) {
        return { success: true, error: "No purchases found to restore" }
      }

      return { success: true }
    } catch (err) {
      console.error("❌ Restore failed:", err)
      const errorMessage = err instanceof Error ? err.message : "Restore failed"
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [isInitialized])

  useEffect(() => {
    const loadOfferings = async () => {
      if (!isInitialized) return

      try {
        setIsLoadingOfferings(true)
        const offerings = await Purchases.getOfferings()

        if (offerings.current) {
          const packages: OfferingPackage[] = offerings.current.availablePackages
            .map((pkg) => {
              const planType = identifyPlanType(pkg)

              if (!planType) {
                console.log("⚠️ Skipping unknown package:", pkg.identifier)
                return null
              }
              const isMonthly =
                pkg.packageType === "MONTHLY" ||
                pkg.identifier === "$rc_monthly" ||
                pkg.product.identifier.toLowerCase().includes("month")
              const isYearly =
                pkg.packageType === "ANNUAL" ||
                pkg.identifier === "$rc_annual" ||
                pkg.product.identifier.toLowerCase().includes("year")

              if (!isMonthly && !isYearly) return null

              // Get formatted price
              const price = pkg.product.priceString

              // Calculate price per month for annual
              let pricePerMonth = price
              if (isYearly && pkg.product.price) {
                const monthlyPrice = pkg.product.price / 12
                pricePerMonth = `$${monthlyPrice.toFixed(2)}/mo`
              }

              return {
                identifier: pkg.identifier,
                planType: isYearly ? "yearly" : "monthly",
                price,
                pricePerMonth,
                product: {
                  identifier: pkg.product.identifier,
                  title: pkg.product.title,
                  description: pkg.product.description,
                },
              }
            })
            .filter(Boolean) as OfferingPackage[]

          setAvailablePackages(packages)
          console.log("📦 Available packages loaded:", packages)
        }
      } catch (err) {
        console.error("Failed to load offerings:", err)
      } finally {
        setIsLoadingOfferings(false)
      }
    }

    loadOfferings()
  }, [isInitialized])

  // Open native subscription management
  const manageSubscription = useCallback(() => {
    Purchases.getCustomerInfo().then((info) => {
      const url = info.managementURL
      if (url) Linking.openURL(url)
    })
  }, [])

  // Refresh subscription status
  const refreshSubscriptionStatus = useCallback(async () => {
    await fetchSubscriptionStatus()
  }, [fetchSubscriptionStatus])

  const value: InAppSubscriptionContextType = {
    subscriptionData,
    isLoading,
    isInitialized,
    error,
    purchasePlan,
    restorePurchases,
    manageSubscription,
    refreshSubscriptionStatus,
    isLoadingOfferings,
    availablePackages,
  }

  return (
    <InAppSubscriptionContext.Provider value={value}>{children}</InAppSubscriptionContext.Provider>
  )
}

export const useSubscription = () => {
  const context = useContext(InAppSubscriptionContext)
  if (!context) {
    throw new Error("useInAppSubscriptionContext must be used within InAppSubscriptionProvider")
  }
  return context
}
