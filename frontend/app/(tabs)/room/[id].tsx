import { View, Text, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fetch room members
async function getMembers(roomId: string) {
  try {
    const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
    const options = {
      method: "GET",
      url: `http://localhost:5000/rooms/members/${roomId}`,
      headers: {
        bearer: `Bearer ${token}`,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.request(options);
    console.log("Fetched members:", data);
    return data;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}

export default function RoomScreen() { // works with these params
  const  id  = "feda0943-fde0-4020-b5d5-1cdc3a588340"; // Get the room ID from the URL
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (id) {
      getMembers(id).then((data) => setItems(data));
    }
  }, [id]);

  const handleBoxPress = (memberId: string) => {
    router.push(`/guarded/${memberId}`); // Navigate to the guarded member page
  };

  return (
    <View className="flex-1 items-center px-5 pt-5 bg-background">
      <Text className="text-2xl font-bold mb-5 text-text">Room {id}</Text>

      {/* List of Room Members */}
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleBoxPress(item.id)} // Navigate using member ID
          className="w-11/12 max-w-[350px] h-20 flex-row items-center p-4 mb-3 rounded-lg border-2 border-secondary bg-white"
        >
          {/* Member Image */}
          <Image
            source={require("@/assets/images/i_orkestura_da_sviri.jpeg")}
            className="w-12 h-12 rounded-full mr-3"
            resizeMode="cover"
          />
          <Text className="text-lg font-semibold text-text">{item.name}</Text>
        </TouchableOpacity>
      ))}

      {/* Add Item Button */}
      <TouchableOpacity className="w-11/12 max-w-[350px] h-20 items-center justify-center rounded-lg bg-primary mt-4">
        <Text className="text-white text-4xl font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
