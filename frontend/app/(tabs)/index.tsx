import "react-native-reanimated";
import React, { useState } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors"; // Import theme

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

  const renderItem = ( { item }: { item: { text: string, image: any } } ) => (
    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: colors.lightBackground, width, height }}>
      <TouchableOpacity style={{ position: "absolute", top: 30, right: 20, backgroundColor: colors.primary, padding: 10, borderRadius: 8 }} onPress={handleSignIn}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Sign In</Text>
      </TouchableOpacity>

      <Image source={item.image} style={{ width: width * 0.75, height: height * 0.35, resizeMode: "contain", marginTop: -70 }} />
      <Text style={{ fontSize: 32, fontWeight: "bold", color: colors.gray, textAlign: "center", marginBottom: 20 }}>{item.text}</Text>

      <TouchableOpacity
        style={{ position: "absolute", bottom: 80, backgroundColor: colors.primary, padding: 20, borderRadius: 10, width: "80%", alignItems: "center" }}
        onPress={handleGetStarted}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={panels}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={({ viewableItems }) => setCurrentIndex(viewableItems[0]?.index || 0)}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
      <View style={{ position: "absolute", bottom: 20, flexDirection: "row", justifyContent: "center", width: "100%" }}>
        {panels.map((_, index) => (
          <View key={index} style={{ width: 10, height: 10, borderRadius: 5, marginHorizontal: 5, backgroundColor: currentIndex === index ? colors.primary : "gray" }} />
        ))}
      </View>
    </View>
  );
}
