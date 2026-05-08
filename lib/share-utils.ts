import { Platform, Alert, Share } from "react-native";

/**
 * Share card image via system Share Sheet (works with any app)
 * Uses React Native's built-in Share API instead of expo-sharing
 */
export async function shareToFriends(viewRef: React.RefObject<any>): Promise<void> {
  try {
    if (!viewRef.current?.capture) {
      Alert.alert("エラー", "画像の生成に失敗しました");
      return;
    }
    const uri = await viewRef.current.capture();
    if (Platform.OS === "web") {
      Alert.alert("お知らせ", "共有機能はモバイルアプリでのみ利用できます");
      return;
    }
    await Share.share(
      Platform.OS === "ios"
        ? { url: uri }
        : { message: uri }
    );
  } catch (error: any) {
    if (error?.message === "User did not share") {
      // User cancelled - not an error
      return;
    }
    console.error("Share error:", error);
    Alert.alert("エラー", "共有に失敗しました。もう一度お試しください。");
  }
}
