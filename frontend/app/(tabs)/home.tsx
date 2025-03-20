import { View, TouchableOpacity, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: colors.lightBackground, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.gray, marginTop: 20, marginBottom: 20 }}>Home Page</Text>

      {[1, 2, 3].map((num) => (
        <View key={num} style={{ width: "100%", height: 100, backgroundColor: colors.cardBg, borderRadius: 10, marginBottom: 20, flexDirection: "row", alignItems: "center", padding: 10 }}>
          <Image source={require("@/assets/images/i_orkestura_da_sviri.jpeg")} style={{ width: 50, height: 50, marginRight: 10 }} />
          <Text style={{ fontSize: 16, color: colors.gray, flex: 1 }}>Placeholder Text for Box {num}</Text>
        </View>
      ))}

      <TouchableOpacity style={{ width: "100%", height: 100, backgroundColor: colors.highlight, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "white", fontSize: 40, fontWeight: "bold" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
