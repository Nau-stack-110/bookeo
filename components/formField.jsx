import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'

const FormField = ({title, otherStyles, value, handleChangeText, placeholder, ...props}) => {
    const [showPassword, setshowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-gray-100 text-base mb-1 font-sans-serif'>{title}</Text>
      <View className="w-full h-16 px-4 bg-black rounded-2xl border-2 border-black
       focus:border-red-300 flex-row items-center">
        <TextInput
            className="flex-1 text-white text-base font-semibold"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword }
        />
        {title === "Password" && (
            <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
                <FontAwesome name={!showPassword ? 'eye' : 'eye-slash'} color={'white'} size={18} />
            </TouchableOpacity>
        )}
      </View>
    </View>

  )
}

export default FormField