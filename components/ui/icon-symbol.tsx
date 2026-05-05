import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "mic.fill": "mic",
  "stop.fill": "stop",
  "arrow.clockwise": "refresh",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "play.fill": "play-arrow",
  "checkmark.circle.fill": "check-circle",
  "xmark.circle.fill": "cancel",
  "flame.fill": "local-fire-department",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "trash.fill": "delete",
  "plus": "add",
  "speaker.wave.2.fill": "volume-up",
  "house.fill": "home",
  "gearshape.fill": "settings",
  "sun.max.fill": "light-mode",
  "moon.fill": "dark-mode",
  "paperplane.fill": "send",
  "magnifyingglass": "search",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
