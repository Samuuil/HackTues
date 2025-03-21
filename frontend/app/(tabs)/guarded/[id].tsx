import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState<{
    gps: {
      long: number;
      lat: number;
    };
    bpm: number;
  }>({
    gps: {
      long: 0,
      lat: 0,
    },
    bpm: 0, // Initialize bpm as a number
  });

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = new WebSocket('ws://localhost:8080');

    // WebSocket event listeners
    socket.onopen = () => {
      setConnected(true);
      console.log('Connected to WebSocket server');

      // Authenticate after 2 seconds
      setTimeout(() => {
        socket.send(
          JSON.stringify({
            type: 'authenticate',
            payload: {
              member_id: '4e0973cf-8bcb-4fb5-bb16-4026b4ba852f',
              room_id: 'feda0943-fde0-4020-b5d5-1cdc3a588340',
            },
          })
        );
      }, 2000);

      // Send new data periodically
      setInterval(() => {
        socket.send(
          JSON.stringify({
            type: 'newData',
            payload: {
              member_id: '4e0973cf-8bcb-4fb5-bb16-4026b4ba852f',
              newData: {
                gps: {
                  long: 9,
                  lat: 9,
                },
                bpm: Math.floor(Math.random() * (80 - 60 + 1)) + 60, // Random bpm value between 60 and 80
              },
            },
          })
        );
      }, 2000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data); // Only parse once
      console.log('Received:', data);

      // Check if newData exists
      if (data.newData) {
        // Update the state with the new data
        setMessage(data.newData);

        // Trigger notification if bpm exceeds 65
        if (data.newData.bpm > 65) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: 'Pulse Alert!',
              body: `BPM is high: ${data.newData.bpm}. GPS: Long - ${data.newData.gps.long}, Lat - ${data.newData.gps.lat}`,
              sound: true,
            },
            trigger: null, // Show the notification immediately
          });
        }
      } else {
        console.log('Unknown message type:', data);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      console.log('Disconnected from WebSocket server');
    };

    // Cleanup WebSocket connection when the component is unmounted
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <View className="flex-1 justify-center items-center p-5">
      <Text className={`text-2xl mb-4 ${connected ? 'text-green-600' : 'text-red-600'}`}>
        {connected ? 'Connected' : 'Disconnected'}
      </Text>
      <Text className="text-lg text-center mb-5">
        {`GPS: Long - ${message.gps.long}, Lat - ${message.gps.lat}\nBPM: ${message.bpm}`}
      </Text>
    </View>
  );
}
