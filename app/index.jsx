import { StatusBar } from 'expo-status-bar';
import { Text, SafeAreaView, ScrollView, View, Image, ImageBackground  } from 'react-native';
import { router } from 'expo-router';
import card from '../assets/taxibelogo.png';
import CustomButton from '../components/customButton';
import bgImage from '../assets/bghome3.png';

export default function App() {
  return (
      <ImageBackground
        source = {bgImage}
        style = {{flex: 1}}
        resizeMode="cover"> 
    <SafeAreaView className=" text-white">

        <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center min-h-[100vh] px-4">
          <Text className="text-[40px] text-[#d32f2f] font-extrabold italic mt-5">
            TaxiBe {' '}
          </Text>

          <Text className="text-lg text-gray-700 text-center mt-2 font-medium px-2">
            Réservez vos places avec confiance à travers toutes les coopératives de Madagascar 🇲🇬
          </Text>

          <Image source={card} className="w-full h-[280px] mt-6 rounded-2xl" resizeMode="contain" />

          <View className="mt-6 mb-4 px-3">
            <Text className="text-center text-2xl font-semibold text-[#388e3c]">
              Explorez le voyage à votre rythme
            </Text>
            <Text className="text-center text-base text-gray-900 mt-2">
              Découvrez des trajets pratiques, sécurisés et abordables dans toutes les régions du pays.
              Rejoignez le mouvement de la mobilité malagasy dès aujourd’hui.
            </Text>
          </View>

          <CustomButton
            title="C O N T I N U E"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-5 rounded-xl bg-green-500 py-4"
            textStyles="text-white text-lg font-bold"
          />
        </View>
      </ScrollView>
     
      <StatusBar style="dark" backgroundColor="#f7f7f7" />
    </SafeAreaView>
      </ImageBackground>
  );
}
