import { Text, View, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";
import { trpc } from "@/lib/trpc";
import { getApiBaseUrl } from "@/constants/oauth";
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";
import { Platform } from "react-native";

export default function RecordScreen() {
  const colors = useColors();
  const router = useRouter();
  const { addEntry, addReviewQuestions } = useStore();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const analyzeMutation = trpc.diary.analyze.useMutation();

  useEffect(() => {
    (async () => {
      const status = await requestRecordingPermissionsAsync();
      setPermissionGranted(status.granted);
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  useEffect(() => {
    if (recorderState.isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recorderState.isRecording]);

  const startRecording = async () => {
    setRecordingDuration(0);
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopAndAnalyze = async () => {
    await audioRecorder.stop();
    const uri = audioRecorder.uri;
    if (!uri) return;

    setIsAnalyzing(true);

    try {
      // Upload audio and get analysis
      const formData = new FormData();

      if (Platform.OS === "web") {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append("audio", blob, "recording.webm");
      } else {
        formData.append("audio", {
          uri,
          type: "audio/m4a",
          name: "recording.m4a",
        } as any);
      }

      // Upload to server storage first
      const uploadResponse = await fetch(
        `${getApiBaseUrl()}/api/upload-audio`,
        {
          method: "POST",
          body: formData,
        }
      );
      const { audioUrl } = await uploadResponse.json();

      // Analyze with AI
      const result = await analyzeMutation.mutateAsync({ audioUrl });

      // Save entry
      const entry = {
        id: `entry_${Date.now()}`,
        date: new Date().toISOString(),
        transcript: result.transcript,
        corrections: result.corrections,
        grammarScore: result.grammarScore,
        pronunciationScore: result.pronunciationScore,
        fluencyScore: result.fluencyScore,
        overallScore: result.overallScore,
      };
      addEntry(entry);

      // Generate review questions from corrections
      if (result.corrections.length > 0) {
        const questions = result.corrections.map((c: any, idx: number) => ({
          id: `review_${Date.now()}_${idx}`,
          diaryId: entry.id,
          original: c.original,
          correct: c.corrected,
          explanation: c.explanation,
          mastered: false,
        }));
        addReviewQuestions(questions);
      }

      // Navigate to result
      router.replace(`/result?entryId=${entry.id}` as any);
    } catch (error) {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isAnalyzing) {
    return (
      <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-lg font-semibold text-foreground mt-4">分析中...</Text>
          <Text className="text-sm text-muted mt-2 text-center">
            あなたの英語を分析しています{"\n"}少々お待ちください
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}>
      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 8, alignSelf: "flex-start" }]}
      >
        <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
      </Pressable>

      <View className="flex-1 items-center justify-center">
        {/* Timer */}
        <Text className="text-5xl font-light text-foreground mb-8">
          {formatTime(recordingDuration)}
        </Text>

        {/* Recording indicator */}
        {recorderState.isRecording && (
          <View className="flex-row items-center mb-6">
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.error,
                marginRight: 8,
              }}
            />
            <Text className="text-base text-muted">録音中...</Text>
          </View>
        )}

        {/* Record/Stop button */}
        <Pressable
          onPress={recorderState.isRecording ? stopAndAnalyze : startRecording}
          style={({ pressed }) => [
            {
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: recorderState.isRecording ? colors.error : colors.primary,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
              shadowColor: recorderState.isRecording ? colors.error : colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            },
          ]}
        >
          {recorderState.isRecording ? (
            <IconSymbol name="stop.fill" size={56} color="#FFFFFF" />
          ) : (
            <IconSymbol name="mic.fill" size={56} color="#FFFFFF" />
          )}
        </Pressable>

        <Text className="text-sm text-muted mt-6 text-center">
          {recorderState.isRecording
            ? "ストップボタンを押して分析を開始"
            : "タップして録音開始\n今日あったことを英語で話してみよう"}
        </Text>
      </View>
    </ScreenContainer>
  );
}
