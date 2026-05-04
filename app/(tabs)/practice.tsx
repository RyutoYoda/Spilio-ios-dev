import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface PracticeMode {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const practiceModes: PracticeMode[] = [
  {
    id: "quiz",
    title: "4択クイズ",
    description: "日本語に合う英語表現を4つの選択肢から選ぶ",
    icon: "🎯",
    color: "#2563EB",
  },
  {
    id: "fill",
    title: "穴埋め問題",
    description: "文中の空欄に適切な語を入力する",
    icon: "✏️",
    color: "#7C3AED",
  },
  {
    id: "reorder",
    title: "並べ替え問題",
    description: "バラバラの単語を正しい語順に並べ替える",
    icon: "🔀",
    color: "#059669",
  },
  {
    id: "writing",
    title: "英作文チャレンジ",
    description: "日本語を見て英文を自分で書く",
    icon: "📝",
    color: "#D97706",
  },
];

export default function PracticeScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer className="px-4 pt-4">
      <Text className="text-2xl font-bold text-foreground mb-2">練習</Text>
      <Text className="text-sm text-muted mb-4">アウトプットで定着させましょう</Text>

      <FlatList
        data={practiceModes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-surface rounded-2xl p-5 mb-4 border border-border"
            activeOpacity={0.7}
            onPress={() => router.push(`/practice/${item.id}` as any)}
          >
            <View className="flex-row items-center mb-2">
              <Text className="text-3xl mr-3">{item.icon}</Text>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">{item.title}</Text>
                <Text className="text-xs text-muted mt-1">{item.description}</Text>
              </View>
            </View>
            <View className="h-1 rounded-full mt-2" style={{ backgroundColor: item.color, opacity: 0.3 }} />
          </TouchableOpacity>
        )}
      />
    </ScreenContainer>
  );
}
