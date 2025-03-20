import "react-native-reanimated";
import React, { useState } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors"; // Import theme
import "../../global.css"; 

const { width, height } = Dimensions.get("window");

export default function IndexPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGetStarted = () => router.push("/home");
  const handleSignIn = () => router.push("/login");

  const panels = [
    { text: "Feature, Feature, Feature", image: require("@/assets/images/i_orkestura_da_sviri.jpeg") },
    { text: "Amazing new feature coming soon!", image: require("@/assets/images/i_orkestura_da_sviri.jpeg") },
    { text: "Stay tuned for exciting updates!", image: require("@/assets/images/i_orkestura_da_sviri.jpeg") },
    { text: "Get started now!", image: require("@/assets/images/i_orkestura_da_sviri.jpeg") },
  ];

  const renderItem = ({ item }: { item: { text: string; image: any } }) => (
    <View className="flex-1 justify-center items-center bg-lightBackground" style={{ width, height }}>
      {/* Sign In Button */}
      <TouchableOpacity
        className="absolute top-7 right-5 bg-primary p-2 rounded-lg"
        onPress={handleSignIn}
      >
        <Text className="text-white font-bold">Sign In</Text>
      </TouchableOpacity>

      {/* Image and Text in the center */}
      <View className="items-center justify-center">
        <Image
          source={item.image}
          style={{ width: width * 0.75, height: height * 0.35, resizeMode: "contain" }}
        />
        <Text className="text-4xl font-bold text-gray text-center mt-4 mb-5">{item.text}</Text>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        className="absolute bottom-20 bg-primary p-5 rounded-lg w-4/5 items-center"
        onPress={handleGetStarted}
      >
        <Text className="text-white font-bold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={panels}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={({ viewableItems }) =>
          setCurrentIndex(viewableItems[0]?.index || 0)
        }
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
      {/* Pagination Dots */}
      <View className="absolute bottom-5 flex-row justify-center w-full">
        {panels.map((_, index) => (
          <View
            key={index}
            className={`w-2.5 h-2.5 rounded-full mx-1 ${
              currentIndex === index ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
