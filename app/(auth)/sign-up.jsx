import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Link, useRouter } from 'expo-router'
import axios from 'axios'
import FormField from '../../components/formField'
import bgImage from '../../assets/bghome3.png'

const Signup = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    email: '',
    tel: '',
    password: '',
    password2: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    tel: '',
    password: '',
    password2: ''
  })

  // Animation for button press
  const scale = useSharedValue(1)
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  const validatePhone = (tel) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(tel)
  }

  const validateForm = () => {
    let valid = true
    const errors = {
      username: '',
      email: '',
      tel: '',
      password: '',
      password2: ''
    }

    if (!form.username.trim()) {
      errors.username = 'Username is required'
      valid = false
    }
    if (!form.email.trim()) {
      errors.email = 'Email is required'
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Invalid email address'
      valid = false
    }
    if (!form.tel.trim()) {
      errors.tel = 'Phone number is required'
      valid = false
    } else if (!validatePhone(form.tel)) {
      errors.tel = 'Invalid phone number'
      valid = false
    }
    if (!form.password) {
      errors.password = 'Password is required'
      valid = false
    }
    if (!form.password2) {
      errors.password2 = 'Confirm password is required'
      valid = false
    } else if (form.password !== form.password2) {
      errors.password2 = 'Passwords do not match'
      valid = false
    }

    setFormErrors(errors)
    return valid
  }

  const submit = async () => {
    if (!validateForm()) {
      setSubmitting(false)
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await axios.post('https://vital-lizard-adequately.ngrok-free.app/register/', {
        username: form.username,
        email: form.email,
        tel: form.tel,
        password: form.password,
        password2: form.password2
      })
      router.push('/sign-in')
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

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
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#FF0000',
              fontStyle: 'italic',
              textShadowColor: 'rgba(0, 128, 0, 0.2)',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 4
            }}>
              TaxiBe <FontAwesome name="taxi" size={40} color="#008000" />
            </Text>
            <Text style={{
              fontSize: 30,
              fontWeight: '600',
              color: '#333',
              marginTop: 10,
              fontStyle:'italic',
              // fontFamily: 'Roboto'
            }}>
              Create Your Account
            </Text>
          </View>
           {/* Sign In Link */}
           <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30
          }}>
            <Text style={{
              fontSize: 16,
              color: '#333',
              fontFamily: 'Roboto'
            }}>
              Already have an account?{' '}
            </Text>
            <Link href="/sign-in" style={{
              fontSize: 16,
              color: '#FF0000',
              fontWeight: 'bold',
              fontFamily: 'Roboto'
            }}>
              Sign In
            </Link>
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

          <FormField
            title="Username"
            value={form.username}
            placeholder="Enter your username"
            handleChangeText={(text) => setForm({ ...form, username: text })}
            error={formErrors.username}
            iconName="user"
          />
          <FormField
            title="Email"
            value={form.email}
            placeholder="Enter your email address"
            handleChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
            error={formErrors.email}
            iconName="envelope"
          />
          <FormField
            title="Phone Number"
            value={form.tel}
            placeholder="Enter your phone number (e.g., +261...)"
            handleChangeText={(text) => setForm({ ...form, tel: text })}
            keyboardType="phone-pad"
            error={formErrors.tel}
            iconName="phone"
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="Enter your password"
            handleChangeText={(text) => setForm({ ...form, password: text })}
            secureTextEntry
            error={formErrors.password}
            iconName="lock"
          />
          <FormField
            title="Confirm Password"
            value={form.password2}
            placeholder="Confirm your password"
            handleChangeText={(text) => setForm({ ...form, password2: text })}
            secureTextEntry
            error={formErrors.password2}
            iconName="lock"
          />

          {/* Sign Up Button */}
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
                  <FontAwesome name="user-plus" size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 18,
                    fontWeight: 'bold',
                    fontFamily: 'Roboto'
                  }}>
                    Sign Up
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  </ImageBackground>
  )
}

export default Signup