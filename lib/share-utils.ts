import { Platform, Linking, Alert } from "react-native";
import * as Sharing from "expo-sharing";
/**
 * Capture a view as an image and share to Instagram Stories
 */
export async function shareToInstagramStory(viewRef: React.RefObject<any>): Promise<void> {
  try {
    if (!viewRef.current?.capture) {
      Alert.alert("エラー", "画像の生成に失敗しました");
      return;
    }

    // Capture the view as a PNG
    const uri = await viewRef.current.capture();

    if (Platform.OS === "web") {
      Alert.alert("お知らせ", "Instagram共有はモバイルアプリでのみ利用できます");
      return;
    }

    // Try to open Instagram Stories directly
    const instagramUrl = `instagram-stories://share?source_application=spilio`;

    const canOpen = await Linking.canOpenURL(instagramUrl);

    if (canOpen) {
      // On iOS/Android, use the Instagram Stories sharing
      await Linking.openURL(instagramUrl);
    } else {
      // Fallback: use system share sheet
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "ストーリーにシェア",
        });
      } else {
        Alert.alert("お知らせ", "この端末では共有機能が利用できません");
      }
    }
  } catch (error) {
    console.error("Share error:", error);
    // Fallback to system share
    try {
      if (viewRef.current?.capture) {
        const uri = await viewRef.current.capture();
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: "image/png",
            dialogTitle: "ストーリーにシェア",
          });
        }
      }
    } catch (e) {
      Alert.alert("エラー", "共有に失敗しました。もう一度お試しください。");
    }
  }
}

/**
 * Share to system share sheet (general purpose)
 */
export async function shareImage(viewRef: React.RefObject<any>): Promise<void> {
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
        dialogTitle: "画像をシェア",
      });
    } else {
      Alert.alert("お知らせ", "この端末では共有機能が利用できません");
    }
  } catch (error) {
    console.error("Share error:", error);
    Alert.alert("エラー", "共有に失敗しました");
  }
}
