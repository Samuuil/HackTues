import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function LocationBPMDisplay() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [bpm, setBpm] = useState<number>(60); // Mock BPM

  useEffect(() => {
    (async () => {

        let loc = {
            l: 5,
            r: 6
      }
      setLocation({
        latitude: loc.l, 
        longitude:  loc.r
      });
    })();

    const bpmInterval = setInterval(() => {
      setBpm((prevBpm) => prevBpm + (Math.random() > 0.5 ? 1 : -1));
    }, 3000);

    return () => clearInterval(bpmInterval);
  }, []);

  return (
    <View className="flex-1 items-center justify-center p-5">
      <Text className="text-xl font-bold">Live Data</Text>
      {location ? (
        <>
          <Text className="text-lg">
            Latitude: {location.latitude.toFixed(6)}
          </Text>
          <Text className="text-lg">
            Longitude: {location.longitude.toFixed(6)}
          </Text>
        </>
      ) : (
        <Text className="text-lg">Fetching location...</Text>
      )}
      <Text className="text-lg mt-2">BPM: {bpm}</Text>
    </View>
  );
}
