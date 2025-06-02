import React from "react";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp, BounceIn } from "react-native-reanimated";
import backgroundImage from "../../assets/bghome3.png";

const About = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 mt-5">
        {/* Header */}
        <Animated.View
          entering={FadeInUp.duration(500)}
          className="flex-row justify-between items-center py-3 px-4 bg-[#D32F2F] rounded-b-3xl shadow-md"
        >
          <Text className="text-2xl font-bold text-white">À Propos</Text>
          <FontAwesome5 name="info-circle" size={24} color="#FFFFFF" />
        </Animated.View>

        {/* Content */}
        <ScrollView className="flex-1 px-4 pt-6">
          {/* Introduction */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)} className="rounded-2xl shadow-md p-6 mb-6">
            <Text className="text-xl font-bold text-[#D32F2F] mb-3">Bienvenue sur Taxi-Brousse</Text>
            <Text className="text-gray-700 text-base leading-6">
              Taxi-Brousse est votre compagnon de voyage moderne pour explorer Madagascar en toute simplicité. Notre application révolutionne la réservation de trajets en taxi-brousse, offrant une expérience fluide, sécurisée et adaptée à vos besoins. Que vous voyagiez pour le travail ou le plaisir, nous vous connectons aux meilleures options de transport avec un maximum de confort et de fiabilité.
            </Text>
          </Animated.View>

          {/* Objective */}
          <Animated.View entering={FadeInDown.duration(500).delay(400)} className="rounded-2xl shadow-md p-6 mb-6">
            <View className="flex-row items-center mb-3">
              <FontAwesome5 name="bullseye" size={24} color="#388E3C" />
              <Text className="text-xl font-bold text-[#D32F2F] ml-2">Notre Objectif</Text>
            </View>
            <Text className="text-gray-700 text-base leading-6">
              Notre mission est de rendre vos déplacements plus pratiques, transparents et agréables. Avec Taxi-Brousse, planifiez vos trajets en quelques clics, accédez à des informations en temps réel sur les disponibilités, et voyagez l'esprit tranquille grâce à des options de paiement sécurisées et une interface intuitive.
            </Text>
          </Animated.View>

          {/* Advantages */}
          <Animated.View entering={FadeInDown.duration(500).delay(600)} className="rounded-2xl shadow-md p-6 mb-6">
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="star" size={24} color="#388E3C" />
              <Text className="text-xl font-bold text-[#D32F2F] ml-2">Nos Avantages</Text>
            </View>
            <View className="space-y-3">
              {[
                {
                  icon: <Feather name="clock" size={20} color="#10B981" />,
                  title: "Gain de Temps",
                  description: "Trouvez et réservez des taxis-brousse en quelques minutes.",
                },
                {
                  icon: <MaterialIcons name="security" size={20} color="#10B981" />,
                  title: "Paiements Sécurisés",
                  description: "Payez via MVola, Orange Money, Airtel Money ou carte bancaire en toute confiance.",
                },
                {
                  icon: <FontAwesome5 name="bus" size={20} color="#10B981" />,
                  title: "Choix Variés",
                  description: "Accédez à une large gamme de taxi-brousse (Standard, VIP, Premium) et coopératives fiables.",
                },
                {
                  icon: <Feather name="map" size={20} color="#10B981" />,
                  title: "Planification Facile",
                  description: "Planifiez vos trajets à l'avance et visualisez les sièges dispo en temps réel.",
                },
                {
                  icon: <MaterialIcons name="people" size={20} color="#10B981" />,
                  title: "Informations sur les Coopératives",
                  description: "Découvrez les coopératives partenaires et leurs contacts pour une transparence totale.",
                },
              ].map((advantage, index) => (
                <View key={index} className="flex-row items-start">
                  <View className="mr-3 mt-1">{advantage.icon}</View>
                  <View>
                    <Text className="text-gray-800 font-semibold">{advantage.title}</Text>
                    <Text className="text-gray-600 text-sm py-2 px-4">{advantage.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Booking Steps */}
          <Animated.View entering={FadeInDown.duration(500).delay(800)} className="rounded-2xl shadow-md p-6 mb-6">
            <View className="flex-row items-center mb-3">
              <FontAwesome5 name="list-ol" size={24} color="#388E3C" />
              <Text className="text-xl font-bold text-[#D32F2F] ml-2">Comment Réserver</Text>
            </View>
            <View className="space-y-4">
              {[
                {
                  step: "1. Planifiez Votre Trajet",
                  description: "Renseignez votre point de départ, destination et date de voyage pour voir les taxis disponibles.",
                },
                {
                  step: "2. Choisissez Votre Taxi-Brousse",
                  description: "Parcourez les options (marque, catégorie, coopérative) et sélectionnez celle qui vous convient.",
                },
                {
                  step: "3. Sélectionnez Vos Sièges",
                  description: "Visualisez le plan des sièges et réservez vos places en un clic.",
                },
                {
                  step: "4. Confirmez et Payez",
                  description: "Validez votre réservation et payez en toute sécurité via l'application.",
                },
                {
                  step: "5. Gérez Vos Billets",
                  description: "Consultez vos réservations, téléchargez vos QR codes et suivez vos trajets.",
                },
              ].map((step, index) => (
                <View key={index} className="flex-row items-start mb-3">
                  <Text className="text-[#D32F2F] font-bold text-lg mr-3">{index + 1}</Text>
                  <View>
                    <Text className="text-gray-800 font-semibold">{step.step}</Text>
                    <Text className="text-gray-600 text-sm">{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Call to Action */}
          <Animated.View entering={FadeInDown.duration(500).delay(1000)} className="bg-[#407243] rounded-2xl shadow-md p-6 mb-10">
            <Text className="text-xl font-bold text-white text-center mb-3">
              Prêt à Voyager ?
            </Text>
            <Text className="text-white text-center mb-4">
              Commencez à planifier votre prochain trajet dès maintenant !
            </Text>
            <View className="flex-row justify-center gap-4">
              <TouchableOpacity
                onPress={() => router.push("/home")}
                className="bg-[#D32F2F] px-6 py-3 rounded-xl"
              >
                <Text className="text-white font-bold">Réserver un Trajet</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default About;