import { Platform, Alert } from "react-native";
import * as Sharing from "expo-sharing";

/**
 * Share card image via system Share Sheet (works with any app)
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

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "友達にシェア",
      });
    } else {
      Alert.alert("お知らせ", "この端末では共有機能が利用できません");
    }
  } catch (error) {
    console.error("Share error:", error);
    Alert.alert("エラー", "共有に失敗しました。もう一度お試しください。");
  }
}
