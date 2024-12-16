import { View, Text, ScrollView } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import FormField from '../../components/formField'
import CustomButton from '../../components/customButton'
import { Link } from 'expo-router'

const Signin = () => {

  const [form, setform] = useState({
    email:'',
    password:''
  });
  const [submitting, setsubmitting] = useState(false)
  const submit = () =>{
    e.preventDefault()
  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='justify-center h-[85vh] w-full px-4 my-6'>
          <Text className='text-white text-[45px] font-semibold italic mb-2'>Naunau  <FontAwesome size={40} color={'#fdba75'} name='home'/></Text>
          <Text className='text-3xl font-semibold mt-10 text-white font-serif'>Log in to Naunau</Text>
          <FormField
            title='Email'
            value={form.email}
            placeholder="Enter your email address"
            handleChangeText={(e) => setform({...form, email:e})}
            otherStyles = "mt-7"
            keyboardType="Email-address"
          />
          <FormField
            title='Password'
            value={form.password}
            placeholder='Enter your passsword'
            handleChangeText={(e) => setform({...form, password:e})}
            otherStyles = "mt-7"
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={submitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-white font-medium" >Don't have an account? </Text>
            <Link href="/sign-up" className='text-lg font-semibold text-orange-300'>Signup</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    )
}

export default Signin