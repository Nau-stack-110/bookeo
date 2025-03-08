import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const posts = [
    { id: 1, title: "First Post", likes: 45 },
    { id: 2, title: "Second Post", likes: 78 },
    { id: 3, title: "Third Post", likes: 23 },
  ];

  return (
    <ScrollView className="flex-1 bg-primaryy">
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(500)} className="pt-12 pb-6 px-4 bg-[#25292e]">
        <Text className="text-3xl font-bold text-white">Home</Text>
        <Text className="text-sm text-gray-400 mt-1">Your latest updates</Text>
      </Animated.View>

      {/* Posts */}
      <View className="px-4 mt-4">
        {posts.map((post, index) => (
          <Animated.View
            key={post.id}
            entering={FadeInDown.duration(500).delay(index * 200)}
            className="bg-white rounded-xl p-4 mb-4 shadow-md"
          >
            <Text className="text-lg font-semibold text-text">{post.title}</Text>
            <View className="flex-row items-center mt-2">
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="heart-outline" size={20} color="#ffd33d" />
                <Text className="ml-1 text-gray-600">{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="ml-4 flex-row items-center">
                <Ionicons name="chatbubble-outline" size={20} color="#ffd33d" />
                <Text className="ml-1 text-gray-600">Reply</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}