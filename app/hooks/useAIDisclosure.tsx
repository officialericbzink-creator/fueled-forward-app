import { useCallback } from "react"
import { useMMKVBoolean } from "react-native-mmkv"
import { storage } from "@/utils/storage"

export const useAIDisclosure = () => {
  const [hasAcceptedAIDisclosure, setHasAcceptedAIDisclosure] = useMMKVBoolean(
    "hasAcceptedAIDisclosure",
    storage,
  )

  const acceptDisclosure = useCallback(() => {
    setHasAcceptedAIDisclosure(true)
  }, [setHasAcceptedAIDisclosure])

  const resetDisclosure = useCallback(() => {
    setHasAcceptedAIDisclosure(false)
  }, [setHasAcceptedAIDisclosure])

  return {
    hasAcceptedAIDisclosure: hasAcceptedAIDisclosure ?? false,
    acceptDisclosure,
    resetDisclosure,
  }
}
