import React, { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({ email: "", username: "", password: "" });
  const router = useRouter();

  const handleRegister = () => {
    setErrorMessage({ email: "", username: "", password: "" });

    if (!email || !username || !password) {
      if (!email) setErrorMessage((prev) => ({ ...prev, email: "Please enter an email address." }));
      if (!username) setErrorMessage((prev) => ({ ...prev, username: "Please enter a username." }));
      if (!password) setErrorMessage((prev) => ({ ...prev, password: "Please enter a password." }));
    } else {
      console.log("Registering with:", email, username, password);
      router.push("/login");
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <View className="flex-1 items-center px-5 pt-24 bg-background">
      <Text className="text-2xl font-bold mb-5 text-text">
        Register
      </Text>

      {/* Email Input */}
      <View className="w-full max-w-xs mb-4">
        {errorMessage.email ? <Text className="text-xs mb-1 ml-2 text-error">{errorMessage.email}</Text> : null}
        <View className="flex-row items-center h-12 rounded-lg px-3 bg-inputBg">
          <MaterialIcons name="email" size={24} color="currentColor" className="mr-3 text-text" />
          <TextInput
            className="flex-1 text-base text-text"
            placeholder="Email"
            placeholderTextColor="currentColor"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      </View>

      {/* Username Input */}
      <View className="w-full max-w-xs mb-4">
        {errorMessage.username ? <Text className="text-xs mb-1 ml-2 text-error">{errorMessage.username}</Text> : null}
        <View className="flex-row items-center h-12 rounded-lg px-3 bg-inputBg">
          <MaterialIcons name="person" size={24} color="currentColor" className="mr-3 text-text" />
          <TextInput
            className="flex-1 text-base text-text"
            placeholder="Username"
            placeholderTextColor="currentColor"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Password Input */}
      <View className="w-full max-w-xs mb-4">
        {errorMessage.password ? <Text className="text-xs mb-1 ml-2 text-error">{errorMessage.password}</Text> : null}
        <View className="flex-row items-center h-12 rounded-lg px-3 bg-inputBg">
          <MaterialIcons name="lock" size={24} color="currentColor" className="mr-3 text-text" />
          <TextInput
            className="flex-1 text-base text-text"
            placeholder="Password"
            placeholderTextColor="currentColor"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      {/* Register Button */}
      <Pressable className="w-full max-w-xs py-3 rounded-lg items-center mt-3 bg-primary" onPress={handleRegister}>
        <Text className="text-lg font-bold text-white">Register</Text>
      </Pressable>

      {/* Login Link */}
      <Text className="mt-6 text-base">
        <Text className="text-text">Already have an account? </Text>
        <Text className="font-bold text-primary" onPress={handleLogin}>
          Login
        </Text>
      </Text>
    </View>
  );
}
