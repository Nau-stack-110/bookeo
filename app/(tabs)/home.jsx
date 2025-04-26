import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import taxiBackground from "../../assets/robot.jpg";

const VILLE_CHOICES = [
  "Antsirabe",
  "Ambatolampy",
  "Antananarivo",
  "Toamasina",
  "Mahajanga",
  "Antsiranana",
  "Fianarantsoa",
  "Toliara",
  "Morondava",
  "Moramanga",
  "Mandoto",
  "Tsiroanimandidy",
  "Ambositra",
  "Betafo",
  "Morafeno",
  "Ambalavao",
  "Tôlanaro",
  "Manakara",
];

const Home = () => {
  const [fromCity, setFromCity] = useState("Antsirabe");
  const [toCity, setToCity] = useState("Antananarivo");
  const [travelDate, setTravelDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    const formattedDate = travelDate.toISOString().split("T")[0];
    const url = `/availableTaxibe?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${formattedDate}`;

    setTimeout(() => {
      setIsLoading(false);
      router.push(url);
    }, 1000);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || travelDate;
    setShowDatePicker(false);
    if (currentDate < new Date()) {
      Alert.alert("Erreur", "Veuillez sélectionner une date future.");
      return;
    }
    setTravelDate(currentDate);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="relative flex-1">
        {/* Background Image */}
        <ImageBackground
          source={taxiBackground}
          className="absolute inset-0 opacity-80"
          resizeMode="cover"
        >
          <View className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-blue-900/80" />
        </ImageBackground>

        {/* Form */}
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-white/95 p-6 rounded-3xl shadow-2xl w-full max-w-md">
            <Text className="text-3xl font-bold text-green-700 mb-6 text-center">
              <Text className="border-b-4 border-green-500">Planifiez</Text> votre trajet
            </Text>

            <View className="space-y-6">
              {/* Departure City */}
              <View>
                <Text className="text-gray-700 mb-2 font-semibold">Départ</Text>
                <View className="border-2 border-gray-200 rounded-xl bg-gray-50">
                  <Picker
                    selectedValue={fromCity}
                    onValueChange={(itemValue) => setFromCity(itemValue)}
                    style={{ height: 50 }}
                    accessibilityLabel="Sélectionner la ville de départ"
                  >
                    {VILLE_CHOICES.map((city) => (
                      <Picker.Item key={city} label={city} value={city} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Destination City */}
              <View>
                <Text className="text-gray-700 mb-2 font-semibold">Destination</Text>
                <View className="border-2 border-gray-200 rounded-xl bg-gray-50">
                  <Picker
                    selectedValue={toCity}
                    onValueChange={(itemValue) => setToCity(itemValue)}
                    style={{ height: 50 }}
                    accessibilityLabel="Sélectionner la ville de destination"
                  >
                    {VILLE_CHOICES.map((city) => (
                      <Picker.Item key={city} label={city} value={city} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Travel Date */}
              <View>
                <Text className="text-gray-700 mb-2 font-semibold">Date de départ</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="border-2 border-gray-200 rounded-xl p-3 bg-gray-50"
                  accessibilityLabel="Sélectionner la date de départ"
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
                    accessibilityLabel="Sélecteur de date"
                  />
                )}
              </View>

              {/* Search Button */}
              <TouchableOpacity
                onPress={handleSearch}
                disabled={isLoading}
                className={`bg-green-500 p-4 rounded-xl flex-row items-center justify-center ${
                  isLoading ? "opacity-50" : ""
                }`}
                accessibilityLabel="Rechercher des trajets"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" className="mr-2" />
                ) : (
                  <Feather name="arrow-right" size={24} color="white" className="mr-2" />
                )}
                <Text className="text-white font-bold text-lg">
                  {isLoading ? "Recherche..." : "Rechercher"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;