import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors"; // Import colors from your theme
import axios from "axios";

export default function HomeScreen() {
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Hardcoded userId and token
  const userId = "fa4f2d82-10c5-4d9a-b4b7-a88d0ad99dd9";
  const token = "huhu";

  // Fetch rooms when the component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      const options = {
        method: "GET",
        url: `http://localhost:5000/rooms/${userId}`,
        headers: { bearer: `Bearer ${token}` }, // Correct Bearer token format
      };

      try {
        const { data } = await axios.request(options);
        console.log("Fetched rooms:", data);

        // Ensure room has a name or set default name if needed
        const formattedRooms = data.map((room: any) => ({
          id: room.id,
          name: room.roomPassword || "Unnamed Room", // Using roomPassword as room name for now
        }));

        setRooms(formattedRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Handle box press (navigation to the room screen)
  const handleBoxPress = (id: number) => {
    router.push(`/room/${id}`);
  };

  // Generate room name based on current timestamp (formatted as YYYYMMDDHHMMSS)
  const generateRoomName = () => {
    const now = new Date();
    return now.toISOString().replace(/[-T:.Z]/g, ""); // Converts to YYYYMMDDHHMMSS format
  };

  // Handle creating a new room
  const handleCreateRoom = async () => {
    const roomName = generateRoomName();

    const options = {
      method: "POST",
      url: "http://localhost:5000/rooms/",
      headers: {
        bearer: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        roomPassword: roomName, // Using generated timestamp string as room password
        userId: userId,
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log("New room created:", data);

      // Assuming API returns a room object with id and roomPassword (use as room name)
      setRooms((prevRooms) => [
        ...prevRooms,
        { id: data.id, name: data.roomPassword || "Unnamed Room" }, // Add the new room to the list
      ]);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  // Render loading state while fetching data
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

      {/* ScrollView to make the rooms list scrollable */}
      <ScrollView className="w-full">
        {/* Map through rooms and display them */}
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

      {/* Add Room Button */}
      <TouchableOpacity
        className="w-full h-24 bg-highlight rounded-lg items-center justify-center bg-primary"
        onPress={handleCreateRoom} // Call API to create a new room
      >
        <Text className="text-white text-4xl font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
