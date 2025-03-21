import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to get token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("token");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Function to get user ID
export const getUserId = async () => {
  try {
    return await AsyncStorage.getItem("id");
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};
