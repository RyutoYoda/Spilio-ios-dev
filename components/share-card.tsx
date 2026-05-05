import { Text, View } from "react-native";
import { forwardRef } from "react";
import { useColors } from "@/hooks/use-colors";

interface ShareCardProps {
  transcript: string;
  correctedTranscript?: string;
  overallScore: number;
  grammarScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  streak: number;
  date: string;
}

export const ShareCard = forwardRef<View, ShareCardProps>(
  ({ transcript, correctedTranscript, overallScore, grammarScore, pronunciationScore, fluencyScore, streak, date }, ref) => {
    const colors = useColors();

    const getScoreColor = (score: number) => {
      if (score >= 80) return "#22C55E";
      if (score >= 60) return "#F59E0B";
      return "#EF4444";
    };

    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    };

    const displayText = correctedTranscript || transcript;

    return (
      <View
        ref={ref}
        collapsable={false}
        style={{
          width: 360,
          backgroundColor: "#1a1a2e",
          borderRadius: 24,
          padding: 28,
          overflow: "hidden",
        }}
      >
        {/* Gradient-like top accent */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: "#4A90D9",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        />

        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#FFFFFF" }}>Spilio</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: "#9BA1A6" }}>{formatDate(date)}</Text>
            {streak > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 12 }}>
                <Text style={{ fontSize: 14, color: "#F59E0B", fontWeight: "600" }}>{streak}日連続</Text>
              </View>
            )}
          </View>
        </View>

        {/* Score Circle */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 4,
              borderColor: getScoreColor(overallScore),
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${getScoreColor(overallScore)}20`,
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: "800", color: getScoreColor(overallScore) }}>
              {overallScore}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: "#9BA1A6", marginTop: 6 }}>Overall Score</Text>
        </View>

        {/* Mini scores */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 20 }}>
          {[
            { label: "Grammar", score: grammarScore },
            { label: "Pronunciation", score: pronunciationScore },
            { label: "Fluency", score: fluencyScore },
          ].map((item) => (
            <View key={item.label} style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: getScoreColor(item.score) }}>
                {item.score}
              </Text>
              <Text style={{ fontSize: 10, color: "#9BA1A6", marginTop: 2 }}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* English text */}
        <View
          style={{
            backgroundColor: "#16213e",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 15, color: "#ECEDEE", lineHeight: 22, fontStyle: "italic" }}>
            "{displayText}"
          </Text>
        </View>

        {/* Footer */}
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 11, color: "#687076" }}>
            英語で今日を語ろう - Spilio
          </Text>
        </View>
      </View>
    );
  }
);

ShareCard.displayName = "ShareCard";
