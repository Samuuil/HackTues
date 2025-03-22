import "react-native-reanimated";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors";
import "../../global.css"; 
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import { useFonts } from 'expo-font';
import { registerForPushNotificationsAsync } from "@/utils/notifications";

import { DancingScript_400Regular } from '@expo-google-fonts/dancing-script';

export default function IndexPage() {
  useEffect(() => {
    registerForPushNotificationsAsync();
    
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width, height } = Dimensions.get("window");

  const handleGetStarted = () => router.push("/login");

  const panels = [
    { text: "Care for the elderly with love", image: require("@/assets/images/dqdo.jpg") },
    { text: "Stay alerted if someone falls down", image: require("@/assets/images/personFallingDown.jpg") },
    { text: "Assist Alzheimer’s patients with ease", image: require("@/assets/images/alzheimer.jpg") },
    { text: "Join the movement today!", image: require("@/assets/images/endlessPossibilities.jpg") },
  ];

  const [fontsLoaded] = useFonts({
    DancingScript_400Regular, 
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const renderItem = ({ item }: { item: { text: string; image: any } }) => (
    <View className="flex-1 justify-center items-center bg-lightBackground" style={{ width, height }}>
      <View className="items-center justify-center">
        <Image source={item.image} style={{ width: width * 0.75, height: height * 0.35, resizeMode: "contain" }} />
        <Text style={{
          fontSize: 28,
          fontFamily: 'DancingScript_400Regular',
          color: '#5f4b8b', 
          textAlign: 'center',
          marginTop: 16,
          marginBottom: 20,
        }}>
          {item.text}
        </Text>
      </View>

      <TouchableOpacity className="absolute bottom-20 bg-primary p-5 rounded-lg w-4/5 items-center" onPress={handleGetStarted}>
        <Text className="text-white font-bold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-[#faede4]">
      {/* Fallguard Title */}
      <View style={{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
      }}>
        <Text style={{
          fontSize: 48, 
          fontFamily: 'DancingScript_400Regular', 
          fontWeight: 'bold',
          color: '#5f4b8b',
          textTransform: 'uppercase',
          letterSpacing: 2, 
        }}>
          Fallguard
        </Text>
      </View>

      {/* FlatList */}
      <FlatList
        data={panels}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
          }
        }}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
      
      {/* Page Indicators */}
      <View className="absolute bottom-5 flex-row justify-center w-full">
        {panels.map((_, index) => (
          <View 
            key={index} 
            className={`w-2.5 h-2.5 rounded-full mx-1 ${currentIndex === index ? 'bg-primary' : 'bg-gray-300'}`} 
          />
        ))}
      </View>
    </View>
  );
}
