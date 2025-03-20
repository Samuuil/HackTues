import { View, Text, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function RoomScreen() {
  const { id } = useLocalSearchParams(); // ✅ Get the dynamic room ID
  const router = useRouter();

  // Simulate a dynamic list of items in the room (can be fetched from an API)
  const items = ["Item 1", "Item 2", "Item 3", "Item 4"]; // Example items

  return (
    <View className="flex-1 items-center px-5 pt-5 bg-background">
      {/* Room Title */}
      <Text className="text-2xl font-bold mb-5 text-text">
        Room {id}
      </Text>

      {/* List of Items in the Room */}
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(`/room/${id}/item/${index + 1}`)} // Example navigation
          className="w-11/12 max-w-[350px] h-20 flex-row items-center p-4 mb-3 rounded-lg border-2 border-secondary bg-white"
        >
          {/* Image on the Left */}
          <Image
            source={require("@/assets/images/i_orkestura_da_sviri.jpeg")} // Replace with your image path
            className="w-12 h-12 rounded-full mr-3" // Smaller image size
            resizeMode="cover" // Ensure the image fits properly
          />

          {/* Item Text */}
          <Text className="text-lg font-semibold text-text">
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Add Item Button */}
      <TouchableOpacity
        className="w-11/12 max-w-[350px] h-20 items-center justify-center rounded-lg bg-primary mt-4"
      >
        <Text className="text-white text-4xl font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}