import { View, Text, ScrollView } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import FormField from '../../components/formField'
import CustomButton from '../../components/customButton'
import { Link, useRouter } from 'expo-router'
import axios from 'axios'

const Signup = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setSubmitting(true)
    setError('')
    if (form.password !== form.password2) {
      setError('Passwords do not match.')
      setSubmitting(false)
      return
    }
    try {
      await axios.post('https://vital-lizard-adequately.ngrok-free.app/register/', {
        username: form.username,
        email: form.email,
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

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='justify-center h-[85vh] w-full px-4 my-6'>
          <Text className='text-white text-[45px] font-semibold italic mb-2'>TaxiBe  <FontAwesome size={40} color={'#fdba75'} name='home'/></Text>
          <Text className='text-3xl font-semibold mt-10 text-white font-serif'>Sign up to TaxiBe</Text>
          {error && <Text className='text-red-500 mt-4'>{error}</Text>}
          <FormField
            title='Username'
            value={form.username}
            placeholder="Enter your username"
            handleChangeText={(e) => setForm({...form, username: e})}
            otherStyles="mt-10"
          />
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
          <FormField
            title='Password'
            value={form.password2}
            placeholder='Confirm your password'
            handleChangeText={(e) => setForm({...form, password2: e})}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={submitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-white font-medium">Already have an account? </Text>
            <Link href="/sign-in" className='text-lg font-semibold text-orange-300'>Sign in</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Signup