import { StatusBar } from 'expo-status-bar';
import { Text, SafeAreaView, ScrollView, View, Image } from 'react-native';
import { router } from 'expo-router';
import card from '../assets/hero4.png';
import { FontAwesome } from '@expo/vector-icons';
import CustomButton from '../components/customButton';

export default function App() {
  return (
    <SafeAreaView className="bg-[#f7f7f7]">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center min-h-[100vh] px-4">
          <Text className="text-[40px] text-[#d32f2f] font-extrabold italic mt-5">
            TaxiBe {' '}
            <FontAwesome name="taxi" size={36} color="#008000" />
          </Text>

          <Text className="text-lg text-gray-700 text-center mt-2 font-medium px-2">
            Réservez vos places avec confiance à travers toutes les coopératives de Madagascar 🇲🇬
          </Text>

          <Image source={card} className="w-full h-[280px] mt-6 rounded-2xl" resizeMode="contain" />

          <View className="mt-6 mb-4 px-3">
            <Text className="text-center text-2xl font-semibold text-[#388e3c]">
              Explorez le voyage à votre rythme
            </Text>
            <Text className="text-center text-base text-gray-600 mt-2">
              Découvrez des trajets pratiques, sécurisés et abordables dans toutes les régions du pays.
              Rejoignez le mouvement de la mobilité malagasy dès aujourd’hui.
            </Text>
          </View>

          <CustomButton
            title="Get Started"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-5 bg-[#388e3c] rounded-xl py-4"
            textStyles="text-white text-lg font-bold"
          />
        </View>
      </ScrollView>
      <StatusBar style="dark" backgroundColor="#f7f7f7" />
    </SafeAreaView>
  );
}
