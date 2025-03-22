import { View, Text, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getURL } from "../../../../frontend/getURL";

async function getMembers(roomId: string, token: string) {
  try {
    const url = getURL();
    const options = {
      method: "GET",
      url: `${url}/rooms/members/${roomId}`,
      headers: {
        bearer: `Bearer ${token}`,
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

export default function RoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<{ id: string; name: string }[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await AsyncStorage.getItem("token");
      if (fetchedToken) {
        setToken(fetchedToken);
      } else {
        console.error("No token found in storage");
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (id && token) {
      const roomId = Array.isArray(id) ? id[0] : id;
      AsyncStorage.setItem
      getMembers(roomId, token).then((data) => setItems(data));
    }
  }, [id, token]);

  const handleBoxPress = (memberId: string) => {
    router.push(`/guarded/${memberId}`);
  };

  return (
    <View className="flex-1 items-center px-5 pt-5 bg-background">
      <Text className="text-2xl font-bold mb-5 text-text">Room {id}</Text>

      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleBoxPress(item.id)}
          className="w-11/12 max-w-[350px] h-20 flex-row items-center p-4 mb-3 rounded-lg border-2 border-secondary bg-white"
        >
          <Text className="text-lg font-semibold text-text">{item.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity className="w-11/12 max-w-[350px] h-20 items-center justify-center rounded-lg bg-primary mt-4">
        <Text className="text-white text-4xl font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
