import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react"

import { PaywallModal } from "@/components/Paywall/PaywallModal"

type OpenPaywallOptions = {
  source?: string
  onSubscribed?: () => void
}

type PaywallContextValue = {
  openPaywall: (options?: OpenPaywallOptions) => void
  closePaywall: () => void
}

const PaywallContext = createContext<PaywallContextValue | null>(null)

export const PaywallProvider: FC<PropsWithChildren> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [source, setSource] = useState<string | undefined>(undefined)
  const [onSubscribed, setOnSubscribed] = useState<(() => void) | undefined>(undefined)

  const openPaywall = useCallback((options?: OpenPaywallOptions) => {
    setSource(options?.source)
    setOnSubscribed(() => options?.onSubscribed)
    setVisible(true)
  }, [])

  const closePaywall = useCallback(() => {
    setVisible(false)
    setSource(undefined)
    setOnSubscribed(undefined)
  }, [])

  const handleSubscribed = useCallback(() => {
    const cb = onSubscribed
    closePaywall()
    cb?.()
  }, [closePaywall, onSubscribed])

  return (
    <PaywallContext.Provider value={{ openPaywall, closePaywall }}>
      {children}
      <PaywallModal
        visible={visible}
        source={source}
        onClose={closePaywall}
        onSubscribed={handleSubscribed}
      />
    </PaywallContext.Provider>
  )
}

export function usePaywall() {
  const ctx = useContext(PaywallContext)
  if (!ctx) throw new Error("usePaywall must be used within PaywallProvider")
  return ctx
}
