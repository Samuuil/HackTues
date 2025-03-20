import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export default function MainScreen() {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.gray }]}>yap yap nqkakuv text!</Text>
    </View>
  );
}

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
