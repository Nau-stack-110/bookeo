import { StatusBar } from 'expo-status-bar';
import { Text, SafeAreaView, ScrollView, View, Image } from 'react-native';
import { Link } from 'expo-router';
import card from '../assets/hero4.png';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  return (
    <SafeAreaView className="bg-primary">
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className='w-full justify-center items-center h-full p-4'>
          <Text className='text-white text-3xl font-semibold italic mb-2'>Naunau  <FontAwesome size={40} color={'#fdba75'} name='home'/></Text>
          <Image source={card} className="max-w--[380px] w-full h-[300px]" resizeMode='contain' />
          <View className="relative mt-5">
            <Text className="text-center text-white text-3xl font-bold">Discover Endless Possibilities with 
              <Text className="text-orange-300"> Naunau</Text>
            </Text>
          </View>

          <Text className="text-sm font-light text-gray-100 mt-7 text-center">Where creativity meets innovation: embark on a journey of limitless exploration with naunau!</Text>
        </View>
      </ScrollView>
      <StatusBar style="light"/>

      
      {/* <Text className="text-3xl font-bold">Naunau! </Text>
      <StatusBar style="auto"/>
      <Link href="/home" className='text-blue-600 font-medium ' >Go to home</Link> */}
    </SafeAreaView>
  );
}

