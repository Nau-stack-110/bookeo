import { StatusBar } from 'expo-status-bar';
import { Text, SafeAreaView, ScrollView, View, Image } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import card from '../assets/hero4.png';
import { FontAwesome } from '@expo/vector-icons';
import CustomButton from '../components/customButton';

export default function App() {
  return (
    <SafeAreaView className="bg-primary">
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className='w-full justify-center items-center min-h-[100vh] px-4'>
          <Text className='text-white text-[45px] font-semibold italic mb-2'>TaxiBe  <FontAwesome size={40} color={'#fdba75'} name='home'/></Text>
          <Image source={card} className="max-w--[380px] w-full h-[300px]" resizeMode='contain' />
          <View className="relative mt-5"> 
            <Text className="text-center text-white italic text-3xl font-bold">Discover Endless Possibilities with 
              <Text className="text-orange-300"> TaxiBe</Text>
            </Text>
          </View>

          <Text className="text-sm font-light text-gray-100 mt-7 text-center">Where creativity meets innovation: embark on a journey of limitless exploration with naunau!</Text>
          
          <CustomButton
          title='Continue'
          handlePress={()=> {router.push('/sign-in')}}
          containerStyles="w-full mt-7"
          textStyles="text-primary uppercase"
          />    

        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor='#161622'/>

      {/* <Text className="text-3xl font-bold">Naunau! </Text>
      <Link href="/home" className='text-blue-600 font-medium ' >Go to home</Link> */}
    </SafeAreaView>
  );
}

