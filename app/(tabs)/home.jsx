import React, { useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import taxiBackground from "../../assets/robot.jpg";

const Home = () => {
  const [fromCity, setFromCity] = useState("Antsirabe");
  const [toCity, setToCity] = useState("Antananarivo");
  const [travelDate, setTravelDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const cities = [
    "Antsirabe", "Antananarivo", "Fianarantsoa", "Toamasina",
    "Antsiranana", "Toliara", "Morondava", "Ambositra",
    "Moramanga", "Ambatolampy", "Mahajanga", "Betafo",
    "Tsiroanimandidy", "Mandoto", "Morafeno",
  ];

  const handleSearch = () => {
    if (!fromCity || !toCity) {
      Alert.alert("Erreur", "Veuillez sélectionner les villes de départ et d'arrivée !");
      return;
    }
    const formattedDate = travelDate.toISOString().split("T")[0];
    router.push(`/available-taxibe?from=${fromCity}&to=${toCity}&date=${formattedDate}`);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || travelDate;
    setShowDatePicker(false);
    setTravelDate(currentDate);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="relative flex-1">
        {/* Background Image */}
        <ImageBackground
          source={taxiBackground}
          className="absolute inset-0 opacity-90"
          resizeMode="cover"
        >
          <View className="absolute inset-0 bg-gradient-to-r from-green-800/90 to-blue-900/90" />
        </ImageBackground>

        {/* Formulaire */}
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-white/95 p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <Text className="text-2xl font-bold text-green-700 mb-6 text-center">
              <Text className="border-b-4 border-green-500">Planifiez</Text> votre trajet
            </Text>

            <View className="space-y-6">
              {/* Sélection de la ville de départ */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Départ</Text>
                <View className="border-2 border-gray-200 rounded-xl">
                  <Picker
                    selectedValue={fromCity}
                    onValueChange={(itemValue) => setFromCity(itemValue)}
                    style={{ height: 50 }}
                  >
                    {cities.map((city) => (
                      <Picker.Item key={city} label={city} value={city} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Sélection de la ville de destination */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Destination</Text>
                <View className="border-2 border-gray-200 rounded-xl">
                  <Picker
                    selectedValue={toCity}
                    onValueChange={(itemValue) => setToCity(itemValue)}
                    style={{ height: 50 }}
                  >
                    {cities.map((city) => (
                      <Picker.Item key={city} label={city} value={city} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Sélection de la date */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Date de départ</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="border-2 border-gray-200 rounded-xl p-3"
                >
                  <Text className="text-gray-700">
                    {travelDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={travelDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()} // Empêche de sélectionner une date passée
                  />
                )}
              </View>

              {/* Bouton de recherche */}
              <TouchableOpacity
                onPress={handleSearch}
                className="bg-green-400 p-4 rounded-xl flex-row items-center justify-center"
              >
                <Text className="text-white font-bold text-lg mr-2">
                  Rechercher un TaxiBe
                </Text>
                <Feather name="arrow-right" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;