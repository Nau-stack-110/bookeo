import { StatusBar } from 'expo-status-bar';
import { Text, SafeAreaView } from 'react-native';
import { Link } from 'expo-router'

export default function App() {
  return (
    <SafeAreaView className="items-center justify-center flex-1 bg-slate-100">
      <Text className="text-3xl font-bold">Naunau!</Text>
      <StatusBar style="auto"/>
      <Link href="/profile" className='text-blue-600 font-medium ' >Go to profile</Link>
    </SafeAreaView>
  );
}

