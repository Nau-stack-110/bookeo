import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, ImageBackground } from 'react-native'
import { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Link, useRouter } from 'expo-router'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import bgImage from '../../assets/bghome3.png';

const Signin = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    password: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({ username: '', password: '' })
  
  // Animation for button press
  const scale = useSharedValue(1)
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken')
        if (token) {
          router.replace('/(tabs)/home')
        }
      } catch (err) {
        console.error('Error checking auth:', err)
      }
    }
    checkAuth()
  }, [])

  // Validate form fields
  const validateForm = () => {
    let valid = true
    const errors = { username: '', password: '' }

    if (!form.username.trim()) {
      errors.username = 'Email ou téléphone est obligatiore'
      valid = false
    }
    if (!form.password) {
      errors.password = 'Le mot de passe est obligatoire'
      valid = false
    }

    setFormErrors(errors)
    return valid
  }

  const submit = async () => {
    if (!validateForm()) return

    setSubmitting(true)
    setError('')

    try {
      const response = await axios.post('https://vital-lizard-adequately.ngrok-free.app/token/', {
        username: form.username,
        password: form.password
      })
      const { access, refresh } = response.data
      await AsyncStorage.setItem('accessToken', access)
      await AsyncStorage.setItem('refreshToken', refresh)
      // router.push('/home')
      router.replace('/(tabs)/home')
    } catch (err) {
      console.error('Error:', err.response?.data || err.message)
      setError('Email ou mot de passe invalide. Réesayer!.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle button press animation
  const handlePressIn = () => {
    scale.value = withSpring(0.95)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1)
  }

  return (
    <ImageBackground
    source = {bgImage}
    style = {{flex: 1}}
    resizeMode="cover"> 
    <SafeAreaView style={{ flex: 1 }}>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingVertical: 40,
          // backgroundColor: '#FFFFFF'
        }}>
          {/* Logo and Title */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#FF0000',
              fontStyle: 'italic',
              textShadowColor: 'rgba(0, 128, 0, 0.2)',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 4
            }}>
              TaxiBe 
            </Text>
            <Text style={{
              fontSize: 30,
              fontWeight: '600',
              color: '#333',
              marginTop: 10,
              fontStyle:'italic',
              // fontFamily: 'Roboto'
            }}>
              Connectez-vous
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View style={{
              backgroundColor: '#FF0000',
              padding: 10,
              borderRadius: 8,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <FontAwesome name="exclamation-circle" size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={{ color: '#FFFFFF', fontSize: 16 }}>{error}</Text>
            </View>
          )}

          {/* Username Field */}
          <View style={{ marginBottom: 20 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F5F5F5',
              borderRadius: 12,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderWidth: formErrors.username ? 1 : 0,
              borderColor: formErrors.username ? '#FF0000' : 'transparent'
            }}>
              <FontAwesome name="user" size={24} color="#008000" style={{ marginRight: 10 }} />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: '#333',
                  fontFamily: 'Roboto'
                }}
                placeholder="Email ou téléphone"
                placeholderTextColor="#999"
                value={form.username}
                onChangeText={(text) => setForm({ ...form, username: text })}
                autoCapitalize="none"
              />
            </View>
            {formErrors.username && (
              <Text style={{ color: '#FF0000', fontSize: 14, marginTop: 5 }}>
                {formErrors.username}
              </Text>
            )}
          </View>

          {/* Password Field */}
          <View style={{ marginBottom: 20 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F5F5F5',
              borderRadius: 12,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderWidth: formErrors.password ? 1 : 0,
              borderColor: formErrors.password ? '#FF0000' : 'transparent'
            }}>
              <FontAwesome name="lock" size={24} color="#008000" style={{ marginRight: 10 }} />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: '#333',
                  fontFamily: 'Roboto'
                }}
                placeholder="Votre mot de passe"
                placeholderTextColor="#999"
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                secureTextEntry
              />
            </View>
            {formErrors.password && (
              <Text style={{ color: '#FF0000', fontSize: 14, marginTop: 5 }}>
                {formErrors.password}
              </Text>
            )}
          </View>

          {/* Sign In Button */}
          <Animated.View style={[animatedButtonStyle, { marginTop: 20 }]}>
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={submit}
              disabled={submitting}
              style={{
                backgroundColor: '#008000',
                paddingVertical: 15,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5
              }}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <FontAwesome name="sign-in" size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 18,
                    fontWeight: 'bold',
                    fontFamily: 'Roboto'
                  }}>
                    Se connecter
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Signup Link */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 30
          }}>
            <Text style={{
              fontSize: 16,
              color: '#333',
              fontFamily: 'Roboto'
            }}>
              Vous n'avez pas de compte?{' '}
            </Text>
            <Link href="/sign-up" style={{
              fontSize: 16,
              color: '#FF0000',
              fontWeight: 'bold',
              fontFamily: 'Roboto'
            }}>
              S'inscrire
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  </ImageBackground>
  )
}

export default Signin