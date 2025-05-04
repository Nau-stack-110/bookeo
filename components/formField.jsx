import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'

const FormField = ({ title, value, placeholder, handleChangeText, error, iconName, ...props }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: error ? 1 : 0,
        borderColor: error ? '#FF0000' : 'transparent'
      }}>
        <FontAwesome name={iconName} size={24} color="#008000" style={{ marginRight: 10 }} />
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: '#333',
            fontFamily: 'Roboto'
          }}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={handleChangeText}
          secureTextEntry={(title === 'Password' || title === 'Confirm Password') && !showPassword}
          {...props}
        />
        {(title === 'Password' || title === 'Confirm Password') && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#008000" />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={{ color: '#FF0000', fontSize: 14, marginTop: 5 }}>
          {error}
        </Text>
      )}
    </View>
  )
}

export default FormField