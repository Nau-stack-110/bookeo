import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity
     onPress={handlePress}
     activeOpacity={0.7}
     disabled={isLoading}
     className={`bg-orange-300 rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}>
      <Text className={`text-lg font-bold ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton