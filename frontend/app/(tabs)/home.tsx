import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors"; // Import colors from your theme

export default function HomeScreen() {
  const router = useRouter();

  const handleBoxPress = (id: number) => {
    router.push(`/room/${id}`); // This will navigate to the RoomScreen with the corresponding id
  };

  return (
    <View className="flex-1 items-center bg-lightBackground p-5">
      <Text className="text-2xl font-bold text-gray-700 mt-5 mb-5">Home Page</Text>

      {[1, 2, 3].map((num) => (
        <TouchableOpacity
          key={num}
          className="w-full h-24 bg-cardBg rounded-lg mb-5 flex-row items-center p-3 border border-gray-300"
          onPress={() => handleBoxPress(num)} // Navigate to the corresponding room when the box is pressed
        >
          <Text className="text-lg text-gray-700 flex-1">
            Placeholder Text for Box {num}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        className="w-full h-24 bg-highlight rounded-lg items-center justify-center bg-primary"
      >
        <Text className="text-white text-4xl font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
