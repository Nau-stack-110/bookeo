import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function Create() {
  const [content, setContent] = useState('');

  return (
    <View className="flex-1 bg-primaryy p-4">
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(500)} className="pt-12 pb-6">
        <Text className="text-3xl font-bold text-white">Create</Text>
        <Text className="text-sm text-gray-400 mt-1">Share your thoughts</Text>
      </Animated.View>

      {/* Form */}
      <Animated.View entering={FadeInDown.duration(500).delay(200)} className="flex-1">
        <TextInput
          className="bg-white rounded-xl p-4 h-32 text-text shadow-md"
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          multiline
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity
          className="mt-4 bg-accent py-3 px-6 rounded-lg flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={20} color="#25292e" />
          <Text className="ml-2 text-primaryy font-semibold">Post</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}