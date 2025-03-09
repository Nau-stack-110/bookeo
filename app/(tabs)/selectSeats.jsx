import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"; // For animations

const SelectSeats = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { totalPlaces, availablePlaces, marque, trajetId } = params;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const maxSeats = 4;

  // Static reserved seats for testing
  const reservedSeats = [2, 5, 8]; // Example static data

  const createVehicleLayout = () => {
    const layout = [];
    layout.push([1, 2, 3]); // Driver row

    const remainingSeats = parseInt(totalPlaces) - 3;
    const fullRows = Math.floor(remainingSeats / 4);

    for (let i = 0; i < fullRows; i++) {
      layout.push([4 + i * 4, 5 + i * 4, 6 + i * 4, 7 + i * 4]);
    }

    const remainingSeatsFinal = remainingSeats % 4;
    if (remainingSeatsFinal > 0) {
      layout.push(
        Array.from(
          { length: remainingSeatsFinal },
          (_, i) => parseInt(totalPlaces) - remainingSeatsFinal + i + 1
        )
      );
    }

    return layout;
  };

  const vehicleLayout = createVehicleLayout();

  const handleSeatClick = (seatNumber) => {
    if (seatNumber === 1 || reservedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else if (selectedSeats.length < maxSeats) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const getSeatStyle = (seatNumber) => {
    if (seatNumber === 1) return "bg-gray-800"; // Driver seat
    if (reservedSeats.includes(seatNumber)) return "bg-red-500"; // Reserved
    if (selectedSeats.includes(seatNumber)) return "bg-blue-500"; // Selected
    return "bg-green-500"; // Available
  };

  const handleReservation = () => {
    if (selectedSeats.length === 0) {
      alert("Veuillez sélectionner au moins un siège");
      return;
    }

    // Simulate reservation success with static data
    alert(`Réservation réussie pour ${selectedSeats.length} siège(s)`);
    router.push("/my-tickets"); // Redirect to home or another screen
  };

  const renderSeat = ({ item: seatNumber }) => (
    <TouchableOpacity
      onPress={() => handleSeatClick(seatNumber)}
      disabled={seatNumber === 1 || reservedSeats.includes(seatNumber)}
      className={`w-12 h-12 rounded-lg flex items-center justify-center m-2 ${getSeatStyle(
        seatNumber
      )}`}
      activeOpacity={0.8}
    >
      <Text className="text-white font-bold">
        {seatNumber === 1 ? (
          <Feather name="user" size={20} color="white" /> // Driver icon
        ) : (
          seatNumber
        )}
      </Text>
    </TouchableOpacity>
  );

  const renderRow = ({ item: row }) => (
    <View className="flex-row justify-center">
      <FlatList
        data={row}
        renderItem={renderSeat}
        keyExtractor={(seat) => seat.toString()}
        horizontal
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/availableTaxibe")}
            className="bg-gray-200 p-2 rounded-full"
          >
            <Feather name="arrow-left" size={24} color="gray" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-green-700">
            {marque} - {totalPlaces} places
          </Text>
          <View className="w-10" /> {/* Spacer */}
        </View>

        {/* Seat Layout */}
        <View className="bg-white rounded-xl shadow-md p-4 mx-4 mb-6">
          <FlatList
            data={vehicleLayout}
            renderItem={renderRow}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Legend */}
        <View className="bg-white rounded-xl shadow-md p-4 mx-4 mb-6">
          <View className="flex-row flex-wrap justify-between">
            <View className="flex-row items-center mb-2">
              <View className="w-4 h-4 bg-green-500 rounded mr-2" />
              <Text className="text-sm text-gray-700">Disponible</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <View className="w-4 h-4 bg-red-500 rounded mr-2" />
              <Text className="text-sm text-gray-700">Réservé</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <View className="w-4 h-4 bg-blue-500 rounded mr-2" />
              <Text className="text-sm text-gray-700">Sélectionné</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <View className="w-4 h-4 bg-gray-800 rounded mr-2" />
              <Text className="text-sm text-gray-700">Conducteur</Text>
            </View>
          </View>
        </View>

        {/* Reservation Summary */}
        <View className="bg-white rounded-xl shadow-md p-4 mx-4 mb-6">
          {selectedSeats.length > 0 ? (
            <>
              <Text className="font-semibold text-gray-800 mb-2">
                Sièges sélectionnés :
              </Text>
              {selectedSeats.map((seat) => (
                <View
                  key={seat}
                  className="flex-row justify-between bg-gray-50 p-2 rounded mb-2"
                >
                  <Text className="text-gray-700">Siège {seat}</Text>
                  <Text className="font-semibold text-gray-800">10000 Ar</Text>
                </View>
              ))}
              <View className="border-t border-gray-200 pt-2">
                <View className="flex-row justify-between">
                  <Text className="font-bold text-gray-800">Total :</Text>
                  <Text className="font-bold text-gray-800">
                    {selectedSeats.length * 10000} Ar
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <Text className="text-center text-gray-500 py-4">
              Sélectionnez vos sièges
            </Text>
          )}

          <TouchableOpacity
            onPress={handleReservation}
            disabled={selectedSeats.length === 0}
            className={`mt-4 p-3 rounded-lg flex-row items-center justify-center ${
              selectedSeats.length > 0 ? "bg-blue-500" : "bg-gray-400"
            }`}
          >
            <Text className="text-white font-bold text-lg mr-2">
              Réserver {selectedSeats.length > 0 ? `(${selectedSeats.length})` : ""}
            </Text>
            <Feather name="check" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Alert Animation */}
        {showAlert && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="absolute top-10 left-4 right-4 bg-red-500 p-3 rounded-lg shadow-lg"
          >
            <Text className="text-white text-center">
              Maximum {maxSeats} sièges autorisés
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectSeats;