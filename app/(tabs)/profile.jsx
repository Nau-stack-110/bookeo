import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Static profile image (replace with your asset)
import profileImage from "../../assets/robot.jpg"; // Assuming you have this image

export default function Profile() {
  const router = useRouter();

  // Static user data
  const userData = {
    name: "Jean Rakoto",
    email: "jean.rakoto@example.com",
    phone: "+261 34 123 4567",
    joinedDate: "March 2025",
    totalTrips: 15,
    upcomingTrips: 2,
    completedTrips: 13,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header Section */}
        <Animated.View
          entering={FadeInUp.duration(500)}
          className="pt-12 pb-6 px-4 bg-green-700"
        >
          <Text className="text-3xl font-bold text-white">
            Profil
          </Text>
          <Text className="text-sm text-gray-200 mt-1">
            Gérez votre compte
          </Text>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          className="mx-4 bg-white rounded-xl p-4 mt-6 shadow-md"
        >
          <View className="flex-row items-center">
            <Image
              source={profileImage}
              className="w-20 h-20 rounded-full border-2 border-green-500"
            />
            <View className="ml-4 flex-1">
              <Text className="text-xl font-semibold text-gray-800">
                {userData.name}
              </Text>
              <Text className="text-sm text-gray-600">
                {userData.email}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Inscrit en {userData.joinedDate}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="mt-4 bg-green-500 py-2 px-4 rounded-lg self-start"
            activeOpacity={0.8}
          >
            <Text className="text-white font-medium">
              Modifier le Profil
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          className="flex-row justify-around mx-4 my-6"
        >
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">
              {userData.totalTrips}
            </Text>
            <Text className="text-sm text-gray-600">
              Trajets Total
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">
              {userData.upcomingTrips}
            </Text>
            <Text className="text-sm text-gray-600">
              Trajets à Venir
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">
              {userData.completedTrips}
            </Text>
            <Text className="text-sm text-gray-600">
              Trajets Terminés
            </Text>
          </View>
        </Animated.View>

        {/* Menu Options */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(600)}
          className="mx-4"
        >
          <TouchableOpacity
            className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm"
            onPress={() => router.push("/my-tickets")}
            activeOpacity={0.7}
          >
            <Feather name="ticket" size={24} color="#10B981" />
            <Text className="ml-4 text-gray-800 font-medium">
              Mes Réservations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm"
            onPress={() => router.push("/settings")}
            activeOpacity={0.7}
          >
            <Feather name="settings" size={24} color="#10B981" />
            <Text className="ml-4 text-gray-800 font-medium">
              Paramètres
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm"
            onPress={() => router.push("/home")}
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={24} color="#10B981" />
            <Text className="ml-4 text-gray-800 font-medium">
              Déconnexion
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}