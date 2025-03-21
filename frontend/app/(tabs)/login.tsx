import React, { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
// import { client } from "@/backend/src";
import { getURL } from "../../../frontend/getURL";


const router = useRouter();

async function login(username: string, password: string) {
  //vajen komentar trqbva da pazim id-to na usera, za da moje v posledstvie 
  //da se izpolzva za vzimane na rooms i babi
  // try {
  //   const response = await client.auth.login.post({ username, password });
  //   console.log(response);
  //   if (response.status === 200) {
  //     const token = response.data; // Assuming API returns { token: "..." }
  //     if (token) await AsyncStorage.setItem("token", token); // Save the token to AsyncStorage
  //     console.log("Logged in successfully, token saved:", token);
  //     router.push("/main");
  //   } else {
  //     console.log("Login failed");
  //   }
  // } catch (error) {
  //   console.error("Login error:", error);
  // }
  const url = getURL() + "/auth/login"; 

    const options = {
      method: 'POST',
      url: url,
      headers: { 'Content-Type': 'application/json' },
      data: { username, password }
    };
  
    try {
      const { data } = await axios.request(options);
      console.log(data);
      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("id", data.id);
        console.log("Logged in successfully, token saved:", data.token);
        router.push("/home");
      } else {
        console.log("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }
  
  export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState({ username: "", password: "" });
  
    const handleLogin = () => {
      setErrorMessage({ username: "", password: "" });
  
      if (!username || !password) {
        if (!username) setErrorMessage((prev) => ({ ...prev, username: "Please enter a username." }));
        if (!password) setErrorMessage((prev) => ({ ...prev, password: "Please enter a password." }));
      } else {
        login(username, password);
      }
    };
  
    const handleRegister = () => {
      router.push("/register");
    };
  
    return (
      <View className="flex-1 items-center px-5 pt-24 bg-[#faede4]">
        <Text className="text-2xl font-bold mb-5 text-text">Login</Text>
  
        <View className="w-full max-w-xs mb-4">
          {errorMessage.username ? <Text className="text-xs mb-1 ml-2 text-error">{errorMessage.username}</Text> : null}
          <View className="flex-row items-center h-12 rounded-lg px-3" style={{ backgroundColor: '#fac7a2' }}>
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
  
        <View className="w-full max-w-xs mb-4">
          {errorMessage.password ? <Text className="text-xs mb-1 ml-2 text-error">{errorMessage.password}</Text> : null}
          <View className="flex-row items-center h-12 rounded-lg px-3" style={{ backgroundColor: '#fac7a2' }}>
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
  
        <Pressable className="w-full max-w-xs py-3 rounded-lg items-center mt-3 bg-primary" onPress={handleLogin}>
          <Text className="text-lg font-bold text-white">Login</Text>
        </Pressable>
  
        <Text className="mt-6 text-base">
          <Text className="text-text">Don't have an account? </Text>
          <Text className="font-bold text-primary" onPress={handleRegister}>
            Register
          </Text>
        </Text>
      </View>
    );
  }
  