import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function Bookmark() {
  const bookmarks = [
    { id: 1, title: "Saved Post 1" },
    { id: 2, title: "Saved Post 2" },
  ];

  return (
    <ScrollView className="flex-1 bg-primaryy">
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(500)} className="pt-12 pb-6 px-4 bg-[#25292e]">
        <Text className="text-3xl font-bold text-white">Bookmarks</Text>
        <Text className="text-sm text-gray-400 mt-1">Your saved posts</Text>
      </Animated.View>

      {/* Bookmarks List */}
      <View className="px-4 mt-4">
        {bookmarks.length > 0 ? (
          bookmarks.map((bookmark, index) => (
            <Animated.View
              key={bookmark.id}
              entering={FadeInDown.duration(500).delay(index * 200)}
              className="bg-white rounded-xl p-4 mb-4 shadow-md flex-row items-center justify-between"
            >
              <Text className="text-lg font-medium text-text">{bookmark.title}</Text>
              <TouchableOpacity>
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            </Animated.View>
          ))
        ) : (
          <Animated.View entering={FadeInDown.duration(500)} className="items-center mt-20">
            <Ionicons name="bookmark-outline" size={50} color="#ffd33d" />
            <Text className="text-gray-400 mt-4">No bookmarks yet</Text>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}