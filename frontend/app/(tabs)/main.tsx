import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";
import { WebSocketClient } from "../NotificationHandler";

export default function MainScreen() {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.gray }]}>yap yap nqkakuv text!</Text>
    </View>
  );
}

 const ws = new WebSocketClient("597ed009-f511-4eeb-865a-7128ac6952b5", (v) => {
  console.log(v);
 });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
