// import "react-native-reanimated";
// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, Platform } from "react-native";
// import { useRouter } from "expo-router";
// import { colors } from "@/theme/colors";
// import "../../global.css"; 
// import * as Notifications from "expo-notifications";

// const { width, height } = Dimensions.get("window");

// const registerForPushNotificationsAsync = async () => {
//   if (Platform.OS === "web") {
//     console.log("Push notifications are not supported on web.");
//     return;
//   }

//   let { status } = await Notifications.getPermissionsAsync();
//   if (status !== "granted") {
//     const { status: newStatus } = await Notifications.requestPermissionsAsync();
//     status = newStatus;
//   }

//   if (status !== "granted") {
//     console.log("Failed to get push token for push notification!");
//     return;
//   }

//   const token = (await Notifications.getExpoPushTokenAsync()).data;
//   console.log("Expo Push Token:", token);
// };

// export default function IndexPage() {
//   const router = useRouter();
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     registerForPushNotificationsAsync();
//   }, []);

//   const handleGetStarted = () => router.push("/home");
//   const handleSignIn = () => router.push("/login");

//   const panels = [
//     { text: "Feature, Feature, Feature", image: require("@/assets/images/i_orkestura_da_sviri.jpeg") },
//     { text: "Amazing new feature coming soon!", image: require("@/assets/images/i_orkestura_da_sviri.jpeg") },
//     { text: "Stay tuned for exciting updates!", image: require("@/assets/images/i_orkestura_da_sviri.jpeg") },
//     { text: "Get started now!", image: require("@/assets/images/i_orkestura_da_sviri.jpeg") },
//   ];

//   const renderItem = ({ item }: { item: { text: string; image: any } }) => (
//     <View className="flex-1 justify-center items-center bg-lightBackground" style={{ width, height }}>
//       <TouchableOpacity className="absolute top-7 right-5 bg-primary p-2 rounded-lg" onPress={handleSignIn}>
//         <Text className="text-white font-bold">Sign In</Text>
//       </TouchableOpacity>

//       <View className="items-center justify-center">
//         <Image source={item.image} style={{ width: width * 0.75, height: height * 0.35, resizeMode: "contain" }} />
//         <Text className="text-4xl font-bold text-gray text-center mt-4 mb-5">{item.text}</Text>
//       </View>

//       <TouchableOpacity className="absolute bottom-20 bg-primary p-5 rounded-lg w-4/5 items-center" onPress={handleGetStarted}>
//         <Text className="text-white font-bold">Get Started</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View className="flex-1 bg-background">
//       <FlatList
//         data={panels}
//         renderItem={renderItem}
//         keyExtractor={(_, index) => index.toString()}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onViewableItemsChanged={({ viewableItems }) => {
//           if (viewableItems.length > 0) {
//             setCurrentIndex(viewableItems[0].index || 0);
//           }
//         }}
//         viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
//       />
//       <View className="absolute bottom-5 flex-row justify-center w-full">
//         {panels.map((_, index) => (
//           <View key={index} className={`w-2.5 h-2.5 rounded-full mx-1 ${currentIndex === index ? "bg-primary" : "bg-gray-300"}`} />
//         ))}
//       </View>
//     </View>
//   );
// }

import "react-native-reanimated";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors";
import "../../global.css"; 
import * as Notifications from "expo-notifications";

const { width, height } = Dimensions.get("window");

const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === "web") {
    console.log("Push notifications are not supported on web.");
    return;
  }

  let { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    status = newStatus;
  }

  if (status !== "granted") {
    console.log("Failed to get push token for push notification!");
    Alert.alert("Notification Permission", "Please enable push notifications in your device settings.");
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token:", token);
  
  // Store the token (for example, in AsyncStorage or your backend)
};

export default function IndexPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const handleGetStarted = () => router.push("/login");
  //const handleSignIn = () => router.push("/login");

  const panels = [
    { text: "Look after the elderly", image: require("@/assets/images/dqdo.jpg") },
    { text: "Learn when a loved one falls down", image: require("@/assets/images/personFallingDown.jpg") },
    { text: "Help an alzheimer patient", image: require("@/assets/images/alzheimer.jpg") },
    { text: "Get started now!", image: require("@/assets/images/endlessPossibilities.jpg") },
  ];

  const renderItem = ({ item }: { item: { text: string; image: any } }) => (
    <View className="flex-1 justify-center items-center bg-lightBackground" style={{ width, height }}>
      {/* <TouchableOpacity className="absolute top-7 right-5 bg-primary p-2 rounded-lg" onPress={handleSignIn}>
        <Text className="text-white font-bold">Sign In</Text>
      </TouchableOpacity> */}

      <View className="items-center justify-center">
        <Image source={item.image} style={{ width: width * 0.75, height: height * 0.35, resizeMode: "contain" }} />
        <Text className="text-4xl font-bold text-gray text-center mt-4 mb-5">{item.text}</Text>
      </View>

      <TouchableOpacity className="absolute bottom-20 bg-primary p-5 rounded-lg w-4/5 items-center" onPress={handleGetStarted}>
  <Text className="text-white font-bold">Get Started</Text>
</TouchableOpacity>

    </View>
  );

  return (
    <View className="flex-1 bg-[#faede4]">
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
      <View className="absolute bottom-5 flex-row justify-center w-full">
        {panels.map((_, index) => (
          <View key={index} className={`w-2.5 h-2.5 rounded-full mx-1 ${currentIndex === index ? "bg-primary" : "bg-gray-300"}`} />
        ))}
      </View>
    </View>
  );
}
