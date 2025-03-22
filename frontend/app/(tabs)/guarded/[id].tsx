import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMemberId } from "@/utils/getMemberId";
import { registerForPushNotificationsAsync } from "@/utils/notifications";

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState({
    gps: { lon: 0, lat: 0 },
    bpm: 0,
    acce: { x: 0, y: 0, z: 0 },
    gyro: { x: 0, y: 0, z: 0 },
  });

  const [initialCoords, setInitialCoords] = useState<{ x: number; z: number } | null>(null);
  const [outOfBounds, setOutOfBounds] = useState(false);

  const SQUARE_SIZE = 20000;

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) setExpoPushToken(token);
    });
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://209.38.192.145:8080");

    socket.onopen = async () => {
      setConnected(true);

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
        const data = JSON.parse(event.data);

        if (data.payload.data) {
          setMessage(data.payload.data);

          const newGpsCoords = data.payload.data.gps;

          if (!initialCoords) {
            setInitialCoords({ x: newGpsCoords.lat, z: newGpsCoords.lon });
          } else {
            const deltaX = Math.abs(newGpsCoords.lat - initialCoords.x);
            const deltaZ = Math.abs(newGpsCoords.lon - initialCoords.z);

            if (deltaX > SQUARE_SIZE || deltaZ > SQUARE_SIZE) {
              if (!outOfBounds) {
                setOutOfBounds(true);
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Out of Bounds!",
                    body: "You are out of the designated area.",
                    sound: true,
                  },
                  trigger: null,
                });
              }
            } else {
              setOutOfBounds(false);
            }
          }
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    socket.onclose = () => {
      setConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [outOfBounds, initialCoords]);

  return (
    <ScrollView className="flex-1 p-5 bg-[#faede4]">
      <View className="items-center mb-5">
        {connected ? (
          <Text className="text-2xl font-bold text-green-600">Connected</Text>
        ) : (
          <>
            <ActivityIndicator size="large" color="red" />
            <Text className="text-2xl font-bold text-red-600">Disconnected</Text>
          </>
        )}
      </View>

      <View className="p-4 bg-[#fac7a2] rounded-lg mb-4">
        <Text className="text-lg font-bold text-text">Heart Rate</Text>
        <Text className="text-2xl font-bold text-red-600">{message.bpm} BPM</Text>
      </View>

      <View className="p-4 bg-[#fac7a2] rounded-lg mb-4">
        <Text className="text-lg font-bold text-text">GPS Coordinates</Text>
        <Text className="text-base">Longitude: {message.gps.lon}</Text>
        <Text className="text-base">Latitude: {message.gps.lat}</Text>
      </View>

      <View className="p-4 bg-[#fac7a2] rounded-lg mb-4">
        <Text className="text-lg font-bold text-text">Accelerometer Data</Text>
        <Text className="text-base">X: {message.acce.x.toFixed(2)}</Text>
        <Text className="text-base">Y: {message.acce.y.toFixed(2)}</Text>
        <Text className="text-base">Z: {message.acce.z.toFixed(2)}</Text>
      </View>

      <View className="p-4 bg-[#fac7a2] rounded-lg mb-4">
        <Text className="text-lg font-bold text-text">Gyroscope Data</Text>
        <Text className="text-base">X: {message.gyro.x.toFixed(2)}</Text>
        <Text className="text-base">Y: {message.gyro.y.toFixed(2)}</Text>
        <Text className="text-base">Z: {message.gyro.z.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
}
