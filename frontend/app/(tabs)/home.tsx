// import React from "react";
// import { View, TouchableOpacity, Text } from "react-native";
// import { useRouter } from "expo-router";
// import { colors } from "@/theme/colors"; // Import colors from your theme

// export default function HomeScreen() {
//   const router = useRouter();

//   const handleBoxPress = (id: number) => {
//     router.push(`/room/${id}`); // This will navigate to the RoomScreen with the corresponding id
//   };

  

//   return (
//     <View className="flex-1 items-center bg-lightBackground p-5">
//       <Text className="text-2xl font-bold text-gray-700 mt-5 mb-5">Home Page</Text>

//       {[1, 2, 3].map((num) => (
//         <TouchableOpacity
//           key={num}
//           className="w-full h-24 bg-cardBg rounded-lg mb-5 flex-row items-center p-3 border border-gray-300"
//           onPress={() => handleBoxPress(num)} // Navigate to the corresponding room when the box is pressed
//         >
//           <Text className="text-lg text-gray-700 flex-1">
//             Placeholder Text for Box {num}
//           </Text>
//         </TouchableOpacity>
//       ))}

//       <TouchableOpacity
//         className="w-full h-24 bg-highlight rounded-lg items-center justify-center bg-primary"
//       >
//         <Text className="text-white text-4xl font-bold">+</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }


import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors"; // Import colors from your theme

// Mock function to simulate fetching data from the backend
const fetchRooms = () => {
  return new Promise<{ id: number; name: string }[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Room 1" },
        { id: 2, name: "Room 2" },
        { id: 3, name: "Room 3" },
        { id: 4, name: "Room 4" },
        { id: 5, name: "Room 5" },
      ]);
    }, 1000); // Simulate network delay
  });
};

// Mock function to simulate creating a new room
const createRoom = (rooms: { id: number; name: string }[]) => {
  const newId = rooms.length + 1; // Simple new ID logic, can be replaced with backend logic
  const newRoom = { id: newId, name: `Room ${newId}` }; // New room name logic
  return newRoom;
};

export default function HomeScreen() {
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true); // Loading state for simulating data fetch
  const router = useRouter();

  // Fetch rooms when the component mounts
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms(); // Simulate fetching data
        setRooms(data); // Set the rooms state with the fetched data
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    loadRooms(); // Call the function to load the rooms
  }, []);

  // Handle box press (navigation to the room screen)
  const handleBoxPress = (id: number) => {
    router.push(`/room/${id}`); // This will navigate to the RoomScreen with the corresponding id
  };

  // Handle creating a new room
  const handleCreateRoom = () => {
    const newRoom = createRoom(rooms); // Create a new room
    setRooms((prevRooms) => [...prevRooms, newRoom]); // Add the new room to the rooms array
  };

  // Render loading state while fetching data
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-lightBackground p-5">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-5">Loading rooms...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center bg-lightBackground p-5">
      <Text className="text-2xl font-bold text-gray-700 mt-5 mb-5">Home Page</Text>

      {/* ScrollView to make the rooms list scrollable */}
      <ScrollView className="w-full">
        {/* Map through rooms and display them */}
        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            className="w-full h-24 bg-cardBg rounded-lg mb-5 flex-row items-center p-3 border border-gray-300"
            onPress={() => handleBoxPress(room.id)} // Navigate to the corresponding room when the box is pressed
          >
            <Text className="text-lg text-gray-700 flex-1">{room.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Item Button to create a new room */}
      <TouchableOpacity
        className="w-full h-24 bg-highlight rounded-lg items-center justify-center bg-primary"
        onPress={handleCreateRoom} // Call the function to create a new room
      >
        <Text className="text-white text-4xl font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}

