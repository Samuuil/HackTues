import React, { useState } from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
// import { client } from "../../../backend/src";
import {treaty} from "@elysiajs/eden"

export const client
 = treaty
<App
>('localhost:5000')




class Auth{
    async login(username: string, password: string): Promise<{userId: string, token: string}> {
        return {
            userId: "0a6b2574-57b7-4d0c-8462-8e172b77b68a",
            token: "huhu"
        }
    }
}

const auth = new Auth()


class Room{
    async createRoom(roomPassword: string, userId: string) {
        
    }
}

export default function HomeScreen() {
  const [roomPassword, setRoomPassword] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    auth
  };

  return (
    <View className="flex-1 items-center bg-lightBackground p-5">
      <Text className="text-2xl font-bold text-gray-700 mt-5 mb-5">
        Home Page
      </Text>

      <TextInput
        value={roomPassword}
        onChangeText={setRoomPassword}
        placeholder="Type something..."
        style={{ borderWidth: 1, padding: 10, width: "80%", borderRadius: 5 }}
      />

      <TouchableOpacity
        onPress={handleSubmit} // Call handleSubmit when button is pressed
        style={{
          backgroundColor: "green",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Submit</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 10 }}>You typed: {roomPassword}</Text>
    </View>
  );
}
