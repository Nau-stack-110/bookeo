import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import logo from "../../assets/taxibelogo.png";
import bgImage from '../../assets/bghome3.png';

const VILLE_CHOICES = [
  "Antsirabe", "Ambatolampy", "Antananarivo", "Toamasina", "Mahajanga", "Antsiranana",
  "Fianarantsoa", "Toliara", "Morondava", "Moramanga", "Mandoto", "Tsiroanimandidy",
  "Ambositra", "Betafo", "Morafeno", "Ambalavao", "Tôlanaro", "Manakara",
];

const Home = () => {
  const [fromCity, setFromCity] = useState("Antsirabe");
  const [toCity, setToCity] = useState("Antananarivo");
  const [travelDate, setTravelDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formatLocalDate = (date) => {
    // Format date in YYYY-MM-DD format in local timezone (EAT)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSearch = () => {
    if (!fromCity || !toCity) {
      Alert.alert("Erreur", "Veuillez sélectionner les villes de départ et d'arrivée.");
      return;
    }
    if (fromCity === toCity) {
      Alert.alert("Erreur", "La ville de départ et d'arrivée doivent être différentes.");
      return;
    }

    setIsLoading(true);
    const formattedDate = formatLocalDate(travelDate);
    const url = `/availableTaxibe?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${formattedDate}`;

    setTimeout(() => {
      setIsLoading(false);
      router.push(url);
    }, 1000);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || travelDate;
    setShowDatePicker(false);
    setTravelDate(currentDate);
  };

  return (
    <ImageBackground
      source={bgImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 px-4">
        <View className="items-center py-6">
          <Image source={logo} resizeMode="contain" className="w-32 h-32 mb-2" />
          <Text className="text-xl font-semibold text-green-700">
            Bienvenue sur <Text className="text-red-600">TaxiBe</Text>
          </Text>
          <Text className="text-sm text-gray-600 text-center mt-1 px-4">
            Réservez facilement votre place auprès des coopératives malgaches.
          </Text>
        </View>

        <View className="bg-white rounded-2xl shadow-md p-6">
          <Text className="text-2xl font-bold text-center text-green-700 mb-4">
            Planifiez votre trajet
          </Text>

          <View className="space-y-5">
            {/* Ville de départ */}
            <View className="mb-4">
              <Text className="text-gray-800 mb-1 font-medium">Ville de départ</Text>
              <View className="border border-gray-300 rounded-xl bg-gray-50">
                <Picker
                  selectedValue={fromCity}
                  onValueChange={(value) => setFromCity(value)}
                  style={{ height: 50 }}
                >
                  {VILLE_CHOICES.map((city) => (
                    <Picker.Item key={city} label={city} value={city} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Ville d'arrivée */}
            <View className="mb-4">
              <Text className="text-gray-800 mb-1 font-medium">Ville d'arrivée</Text>
              <View className="border border-gray-300 rounded-xl bg-gray-50">
                <Picker
                  selectedValue={toCity}
                  onValueChange={(value) => setToCity(value)}
                  style={{ height: 50 }}
                >
                  {VILLE_CHOICES.map((city) => (
                    <Picker.Item key={city} label={city} value={city} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Date */}
            <View className="mb-4">
              <Text className="text-gray-800 mb-1 font-medium">Date de départ</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 rounded-xl p-3 bg-gray-50"
              >
                <Text className="text-gray-700">
                  {travelDate.toLocaleDateString("fr-FR")}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={travelDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Bouton */}
            <TouchableOpacity
              onPress={handleSearch}
              disabled={isLoading}
              className={`flex-row justify-center items-center p-4 rounded-xl ${
                isLoading ? "bg-green-400" : "bg-green-600"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" className="mr-2" />
              ) : (
                <Feather name="search" size={20} color="white" className="mr-2" />
              )}
              <Text className="text-white text-lg font-semibold">
                {isLoading ? "Recherche..." : "Rechercher"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-center mt-6">
          <Text className="text-gray-900 text-sm italic">
            © 2025 Taxi-Brousse – Coopératives – Madagascar 🇲🇬
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Home;