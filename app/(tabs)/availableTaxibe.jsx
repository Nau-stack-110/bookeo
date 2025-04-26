import React, { useState, useEffect } from "react";
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
import axios from "axios";

const AvailableTaxibe = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { from, to, date } = params;

  const [taxibes, setTaxibes] = useState([]);
  const [selectedCooperative, setSelectedCooperative] = useState("Toutes");
  const [loading, setLoading] = useState(true);
  const [cooperatives, setCooperatives] = useState([
    { id: "Toutes", nom: "Toutes les coopératives" },
  ]);

  useEffect(() => {
    const fetchTaxibes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://vital-lizard-adequately.ngrok-free.app/api/available_taxibe/",
          {
            params: { from, to, date },
          }
        );
        setTaxibes(response.data);
      } catch (error) {
        console.error("Error fetching taxibes:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCooperatives = async () => {
      try {
        const response = await axios.get(
          "https://vital-lizard-adequately.ngrok-free.app/api/taxibeget/"
        );
        const uniqueCooperatives = Array.from(
          new Map(
            response.data.map((item) => [
              item.cooperative.id,
              { id: item.cooperative.id, nom: item.cooperative.nom },
            ])
          ).values()
        );
        setCooperatives([
          { id: "Toutes", nom: "Toutes les coopératives" },
          ...uniqueCooperatives,
        ]);
      } catch (error) {
        console.error("Error fetching cooperatives:", error);
      }
    };

    fetchTaxibes();
    fetchCooperatives();
  }, [from, to, date]);

  const filteredTaxibes =
    selectedCooperative === "Toutes"
      ? taxibes
      : taxibes.filter(
          (t) => t.taxibe.cooperative === Number(selectedCooperative)
        );

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return d.toLocaleDateString("fr-FR", options);
  };

  const renderTaxibe = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/selectSeats",
          params: {
            totalPlaces: item.taxibe.nb_place,
            availablePlaces: item.taxibe.place_dispo,
            marque: item.taxibe.marque,
            trajetId: item.id,
          },
        })
      }
      className="bg-white rounded-xl shadow-md p-4 mb-4 mx-2 flex-row items-center justify-between"
    >
      <Image
        source={{
          uri: `https://vital-lizard-adequately.ngrok-free.app/${item.taxibe.photo}`,
        }}
        className="w-20 h-20 rounded-xl"
        resizeMode="cover"
      />
      <View className="flex-1 mx-4">
        <Text className="font-bold text-blue-500 text-lg">
          {item.taxibe.marque}
        </Text>

        <Text className="text-gray-600 text-sm">
          <Feather name="home" size={14} color="gray" />{" "}
          {item.taxibe.cooperative || "N/A"}
        </Text>

        <Text className="text-gray-600 text-sm">
          <Feather name="hash" size={14} color="gray" /> {item.taxibe.matricule}
        </Text>

        <Text className="text-gray-600 text-sm">
          <Feather name="user" size={14} color="gray" /> {item.taxibe.chauffeur}
        </Text>

        <Text className="text-green-600 text-sm">
          <Feather name="users" size={14} color="gray" /> {item.place_dispo}/
          {item.taxibe.nb_place} places
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
          TAXI-BROUSSE DISPONIBLES
        </Text>
        <View className="w-10" /> {/* Spacer */}
      </View>

      {/* Route Info */}
      <View className="items-center mb-6">
        <Text className="text-xl font-semibold text-gray-800">
          {from} → {to}
        </Text>
        <Text className="text-sm text-gray-600">Le {formatDate(date)}</Text>
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
