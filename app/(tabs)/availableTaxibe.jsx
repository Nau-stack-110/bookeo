import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

// Static data for testing
const staticTaxibes = [
  {
    id: 1,
    marque: "Toyota HiAce",
    matricule: "TAX 1234",
    chauffeur: "Jean Rakoto",
    nb_place: 15,
    place_dispo: 5,
    prix: 10000,
    cooperative: { id: 1, nom: "Coopérative Nord" },
    photo: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    marque: "Mercedes Sprinter",
    matricule: "TAX 5678",
    chauffeur: "Marie Rabe",
    nb_place: 20,
    place_dispo: 8,
    prix: 12000,
    cooperative: { id: 2, nom: "Coopérative Sud" },
    photo: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    marque: "Nissan NV350",
    matricule: "TAX 9012",
    chauffeur: "Paul Andry",
    nb_place: 12,
    place_dispo: 3,
    prix: 9000,
    cooperative: { id: 1, nom: "Coopérative Nord" },
    photo: "https://via.placeholder.com/150",
  },
];

const AvailableTaxibe = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { from, to, date } = params;

  const [taxibes] = useState(staticTaxibes);
  const [selectedCooperative, setSelectedCooperative] = useState("Toutes");
  const [loading] = useState(false);

  // Extract unique cooperatives from static data
  const cooperatives = [
    { id: "Toutes", nom: "Toutes les coopératives" },
    ...Array.from(
      new Map(
        staticTaxibes.map((item) => [
          item.cooperative.id,
          { id: item.cooperative.id, nom: item.cooperative.nom },
        ])
      ).values()
    ),
  ];

  const filteredTaxibes =
    selectedCooperative === "Toutes"
      ? taxibes
      : taxibes.filter(
          (t) => t.cooperative.id === Number(selectedCooperative)
        );

  const handleReservationClick = (taxibe) => {
    router.push({
      pathname: "/selectSeats",
      params: {
        totalPlaces: taxibe.nb_place,
        availablePlaces: taxibe.place_dispo,
        marque: taxibe.marque,
        trajetId: taxibe.id,
      },
    });
  };

  const renderTaxibe = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleReservationClick(item)}
      className="bg-white rounded-xl shadow-md p-4 mb-4 mx-2 flex-row items-center"
    >
      <Image
        source={{ uri: item.photo }}
        className="w-24 h-24 rounded-lg mr-4"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-blue-600 font-bold text-lg">{item.marque}</Text>
        <Text className="text-gray-600 text-sm">
          <Feather name="hash" size={14} color="gray" /> {item.matricule}
        </Text>
        <Text className="text-gray-600 text-sm">
          <Feather name="user" size={14} color="gray" /> {item.chauffeur}
        </Text>
        <Text className="text-gray-600 text-sm">
          <Feather name="users" size={14} color="gray" /> {item.place_dispo}/
          {item.nb_place} places
        </Text>
        <Text className="text-yellow-600 font-semibold text-sm mt-1">
          <Feather name="dollar-sign" size={14} color="#D97706" /> {item.prix}{" "}
          Ar/place
        </Text>
      </View>
      <Feather name="chevron-right" size={24} color="gray" />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      {/* Header */}
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="bg-gray-200 p-2 rounded-full"
        >
          <Feather name="arrow-left" size={24} color="gray" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-green-700">
          TaxiBe Disponibles
        </Text>
        <View className="w-10" /> {/* Spacer */}
      </View>

      {/* Route Info */}
      <View className="items-center mb-6">
        <Text className="text-xl font-semibold text-gray-800">
          {from} → {to}
        </Text>
        <Text className="text-sm text-gray-600">Le {date}</Text>
      </View>

      {/* Cooperative Filter */}
      <View className="px-4 mb-6">
        <Text className="text-gray-700 mb-2 font-medium">
          Filtrer par coopérative
        </Text>
        <View className="border-2 border-gray-200 rounded-xl bg-white">
          <Picker
            selectedValue={selectedCooperative}
            onValueChange={(itemValue) => setSelectedCooperative(itemValue)}
            style={{ height: 50 }}
          >
            {cooperatives.map((coop) => (
              <Picker.Item key={coop.id} label={coop.nom} value={coop.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Loading or Empty State */}
      {loading ? (
        <ActivityIndicator size="large" color="#10B981" className="mb-6" />
      ) : filteredTaxibes.length === 0 ? (
        <View className="items-center mb-6">
          <Feather name="truck" size={48} color="gray" />
          <Text className="text-lg text-gray-500 mt-4">
            Aucun TaxiBe disponible
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        data={filteredTaxibes.length > 0 ? filteredTaxibes : []}
        renderItem={renderTaxibe}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<View className="h-20" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </SafeAreaView>
  );
};

export default AvailableTaxibe;