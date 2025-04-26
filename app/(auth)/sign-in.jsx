import { View, Text, ScrollView } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import FormField from '../../components/formField'
import CustomButton from '../../components/customButton'
import { Link, useRouter } from 'expo-router'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Signin = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: ''  
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setSubmitting(true)
    setError('')
    console.log('Form data:', form)
    try {
      const response = await axios.post('https://vital-lizard-adequately.ngrok-free.app/token/', {
        email: form.email,
        password: form.password
      })
      console.log('Response:', response.data)
      const { access, refresh } = response.data
      await AsyncStorage.setItem('accessToken', access)
      await AsyncStorage.setItem('refreshToken', refresh)
      router.push('/home')
    } catch (err) {
      console.error('Error:', err.response?.data || err.message)
      setError('Invalid email or password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='justify-center h-[85vh] w-full px-4 my-6'>
          <Text className='text-white text-[45px] font-semibold italic mb-2'>TaxiBe  <FontAwesome size={40} color={'#fdba75'} name='home'/></Text>
          <Text className='text-3xl font-semibold mt-10 text-white font-serif'>Log in to TaxiBe</Text>
          {error && <Text className='text-red-500 mt-4'>{error}</Text>}
          <FormField
            title='Email'
            value={form.email}
            placeholder="Enter your email address"
            handleChangeText={(e) => setForm({...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title='Password'
            value={form.password}
            placeholder='Enter your password'
            handleChangeText={(e) => setForm({...form, password: e})}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={submitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-white font-medium">Don't have an account? </Text>
            <Link href="/sign-up" className='text-lg font-semibold text-orange-300'>Signup</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Signin