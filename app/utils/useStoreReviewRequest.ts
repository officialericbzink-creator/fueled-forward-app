import { Alert, Linking } from "react-native"
import * as StoreReview from "expo-store-review"

async function askForFeedback(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      "Are you enjoying Pillar Valley?",
      undefined,
      [
        {
          text: "Yes",
          onPress: () => {
            resolve(true)
          },
        },
        {
          text: "Not really",
          style: "cancel",
          onPress: () => {
            resolve(false)
          },
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    )
  })
}

export async function promptToReviewAsync(): Promise<boolean> {
  const likesMe = await askForFeedback()

  if (!likesMe) {
    return false
  }

  const isAvailable = await StoreReview.isAvailableAsync()
  if (!isAvailable) {
    const storeUrl = StoreReview.storeUrl()
    if (!storeUrl) return false
    if (!(await Linking.canOpenURL(storeUrl))) return false
    await Linking.openURL(storeUrl)
  } else {
    await StoreReview.requestReview()
  }
  return true
}
