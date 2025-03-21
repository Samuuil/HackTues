import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors"; // Import colors from your theme
import axios from "axios";
import { getToken, getUserId } from "./storageAuth"; // Import getToken and getUserId functions
import { getURL } from "../../../frontend/getURL";

export default function HomeScreen() {
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null); // Store userId
  const [token, setToken] = useState<string | null>(null); // Store token
  const router = useRouter();
  const url = getURL();

  useEffect(() => {
    const fetchAuthData = async () => {
      const fetchedUserId = await getUserId();
      const fetchedToken = await getToken();
      console.log("aaaaaaaaaa");
      console.log("Fetched user ID and token:", fetchedUserId, fetchedToken);

      if (!fetchedUserId || !fetchedToken) {
        console.error("No user ID or token found");
        return;
      }

      setUserId(fetchedUserId);
      setToken(fetchedToken);
    };

    fetchAuthData();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!userId || !token) return; // Ensure credentials are available
      try {
        const { data } = await axios.get(`${url}/rooms/${userId}`, {
          headers: { bearer: `Bearer ${token}` },
        });
  
        console.log("Fetched rooms:", data);
  
        setRooms(
          data.map((room: any) => ({
            id: room.id,
            name: room.name || "Unnamed Room",
          }))
        );
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRooms();
  }, [userId, token]); // Runs when userId and token are updated
  

  const handleBoxPress = (id: number) => {
    router.push(`/room/${id}`);
  };

  const generateRoomName = () => {
    return Math.floor(Math.random() * 1000000) + 1; // Generates a number between 1 and 1,000,000
  };

  const handleCreateRoom = async () => {
    if (!userId || !token) {
      console.error("No user ID or token available");
      return;
    }
  
    const roomName = generateRoomName();
  
    try {
      const { data } = await axios.post(
        `${url}/rooms/`,
        {
          roomPassword: roomName,
          userId: userId,
        },
        {
          headers: {
            bearer: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("New room created:", data);
      console.log("Fetched rooms data:", JSON.stringify(data, null, 2));
  
      setRooms((prevRooms) => [...prevRooms, { id: data.id, name: data.name || "Unnamed Room" }]);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };
  

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-lightBackground p-5">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-5">Loading rooms...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center bg-lightBackground p-5">
      <Text className="text-2xl font-bold text-gray-700 mt-5 mb-5">Home Page</Text>

      <ScrollView className="w-full">
        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            className="w-full h-24 bg-cardBg rounded-lg mb-5 flex-row items-center p-3 border border-gray-300"
            onPress={() => handleBoxPress(room.id)}
          >
            <Text className="text-lg text-gray-700 flex-1">{room.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity className="w-full h-24 bg-highlight rounded-lg items-center justify-center bg-primary" onPress={handleCreateRoom}>
        <Text className="text-white text-4xl font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
