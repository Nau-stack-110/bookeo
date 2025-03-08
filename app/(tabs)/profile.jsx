import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import card from '../../assets/hero4.png';

export default function Profile() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-primaryy">
      {/* Header Section */}
      <Animated.View entering={FadeInUp.duration(500)} className="pt-12 pb-6 px-4">
        <Text className="text-3xl font-bold text-text">Profile</Text>
        <Text className="text-sm text-gray-400 mt-1">Manage your account</Text>
      </Animated.View>

      {/* Profile Card */}
      <Animated.View entering={FadeInDown.duration(500).delay(200)} className="mx-4 bg-white rounded-xl p-4 mb-6 shadow-lg">
        <View className="flex-row items-center">
          <Image
            source={card} // Remplacez par une URL ou une image locale
            className="w-20 h-20 rounded-full border-2 border-accent"
          />
          <View className="ml-4 flex-1">
            <Text className="text-xl font-semibold text-text">Arnaud Andriatahiana</Text>
            <Text className="text-sm text-gray-400">Nau-Stack-110</Text>
            <Text className="text-xs text-gray-500 mt-1">Joined March 2025</Text>
          </View>
        </View>
        <TouchableOpacity className="mt-4 bg-accent py-2 px-4 rounded-lg self-start">
          <Text className="text-primaryy font-medium">Edit Profile</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Stats Section */}
      <Animated.View entering={FadeInDown.duration(500).delay(400)} className="flex-row justify-around mx-4 mb-6">
        <View className="items-center">
          <Text className="text-lg font-bold text-text">120</Text>
          <Text className="text-sm text-gray-400">Posts</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-text">450</Text>
          <Text className="text-sm text-gray-400">Followers</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-text">300</Text>
          <Text className="text-sm text-gray-400">Following</Text>
        </View>
      </Animated.View>

      {/* Menu Options */}
      <Animated.View entering={FadeInDown.duration(500).delay(600)} className="mx-4">
        <TouchableOpacity
          className="flex-row items-center bg-white p-4 rounded-xl mb-3"
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#ffd33d" />
          <Text className="ml-4 text-text font-medium">Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-xl mb-3">
          <Ionicons name="bookmark-outline" size={24} color="#ffd33d" />
          <Text className="ml-4 text-text font-medium">Bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center  bg-white p-4 rounded-xl mb-3">
          <Ionicons name="log-out-outline" size={24} color="#ffd33d" />
          <Text className="ml-4 text-text font-medium">Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}
