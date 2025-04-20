import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import '../global.css';
import AsyncStorage from '@react-native-async-storage/async-storage'

const RootLayout = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken')
        if (token) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    checkAuthentication()
  }, [])

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <Stack>
      <Stack.Screen name='index' options={ {headerShown:false}}/>
      <Stack.Screen name='(auth)' options={ {headerShown:false}}/>
      {isAuthenticated ? (
        <Stack.Screen name='(tabs)' options={ {headerShown:false}}/>
      ) : (
        <Stack.Screen name='/sign-in' options={ {headerShown:false}}/>
      )}
    </Stack> 
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default RootLayout

