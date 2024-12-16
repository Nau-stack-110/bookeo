import { View, Text, ScrollView } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import FormField from '../../components/formField'
import CustomButton from '../../components/customButton'
import { Link } from 'expo-router'

const Signup = () => {

  const [form, setform] = useState({
    username:'',
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
          <Text className='text-3xl font-semibold mt-10 text-white font-serif'>Sign up to Naunau</Text>
          <FormField
            title='Username'
            value={form.username}
            placeholder="Enter your username"
            handleChangeText={(e) => setform({...form, username:e})}
            otherStyles = "mt-10"
          />
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
            title="Sign up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={submitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-white font-medium" >Already have an account? </Text>
            <Link href="/sign-in" className='text-lg font-semibold text-orange-300'>Sign in</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    )
}

export default Signup