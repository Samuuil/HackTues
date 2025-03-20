import React, { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleLogin = () => {
    setErrorMessage({ username: "", password: "" });

    if (!username || !password) {
      if (!username) setErrorMessage((prev) => ({ ...prev, username: "Please enter a username." }));
      if (!password) setErrorMessage((prev) => ({ ...prev, password: "Please enter a password." }));
    } else {
      console.log("Logging in with:", username, password);
      router.push("/main");
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
        paddingHorizontal: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: colors.text }}>
        Login
      </Text>

      {/* Username Input */}
      <View style={{ width: "80%", maxWidth: 300, marginBottom: 16 }}>
        {errorMessage.username ? (
          <Text style={{ fontSize: 12, marginBottom: 4, color: colors.error }}>
            {errorMessage.username}
          </Text>
        ) : null}
        <View style={{ flexDirection: "row", alignItems: "center", height: 48, borderRadius: 8, paddingHorizontal: 10, backgroundColor: colors.inputBg }}>
          <MaterialIcons name="person" size={24} color={colors.text} style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, fontSize: 16, color: colors.text }}
            placeholder="Username"
            placeholderTextColor={colors.text}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Password Input */}
      <View style={{ width: "80%", maxWidth: 300, marginBottom: 16 }}>
        {errorMessage.password ? (
          <Text style={{ fontSize: 12, marginBottom: 4, color: colors.error }}>
            {errorMessage.password}
          </Text>
        ) : null}
        <View style={{ flexDirection: "row", alignItems: "center", height: 48, borderRadius: 8, paddingHorizontal: 10, backgroundColor: colors.inputBg }}>
          <MaterialIcons name="lock" size={24} color={colors.text} style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, fontSize: 16, color: colors.text }}
            placeholder="Password"
            placeholderTextColor={colors.text}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      {/* Login Button */}
      <Pressable
        style={{
          width: "80%",
          maxWidth: 300,
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
          backgroundColor: colors.primary,
        }}
        onPress={handleLogin}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
          Login
        </Text>
      </Pressable>

      {/* Register Link */}
      <Text style={{ marginTop: 20, fontSize: 16, color: colors.text }}>
        Don't have an account?{" "}
        <Text style={{ fontWeight: "bold", color: colors.primary }} onPress={handleRegister}>
          Register
        </Text>
      </Text>
    </View>
  );
}
