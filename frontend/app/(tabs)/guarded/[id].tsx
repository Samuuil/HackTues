import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMemberId } from "@/utils/getMemberId";
import { registerForPushNotificationsAsync } from "@/utils/notifications";

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState<{ gps: { long: number; lat: number }; bpm: number }>({ gps: { long: 0, lat: 0 }, bpm: 0 });

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) setExpoPushToken(token);
    });
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://209.38.192.145:8080");

    socket.onopen = async () => {
      setConnected(true);
      console.log("Connected to WebSocket server");

      try {
        const memberId = await getMemberId();
        const roomId = await AsyncStorage.getItem("roomId");

        socket.send(
          JSON.stringify({
            type: "authenticate",
            payload: { member_id: memberId, room_id: roomId },
          })
        );
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    socket.onmessage = async (event) => {
      try {
        console.log("Received:", event.data);
        const data = JSON.parse(event.data);

        if (data.payload.data) {
          setMessage(data.payload.data);

          // Send a local notification if BPM is too high
          if (data.payload.data.bpm > 25) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Pulse Alert!",
                body: `BPM is high: ${data.payload.data.bpm}. GPS: Long - ${data.payload.data.gps.long}, Lat - ${data.payload.data.gps.lat}`,
                sound: true,
              },
              trigger: null,
            });
          }
        } else {
          console.warn("Received unknown message:", data);
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <View className="flex-1 justify-center items-center p-5">
      {connected ? (
        <Text className="text-2xl mb-4 text-green-600">Connected</Text>
      ) : (
        <>
          <ActivityIndicator size="large" color="red" />
          <Text className="text-2xl mb-4 text-red-600">Disconnected</Text>
        </>
      )}
      <Text className="text-lg text-center mb-5">
        {`GPS: Long - ${message.gps.long}, Lat - ${message.gps.lat}\nBPM: ${message.bpm}`}
      </Text>
    </View>
  );
}
