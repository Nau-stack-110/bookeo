import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectSeats = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { totalPlaces, availablePlaces, marque, trajetId, price, categorie, from, to, date } = params;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxSeats = 15;

  useEffect(() => {
    const fetchTrajetDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://vital-lizard-adequately.ngrok-free.app/api/trajet/${trajetId}/`);
        setReservedSeats(response.data.seat_indispo || []);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des sièges:', error);
        setLoading(false);
      }
    };

    if (trajetId) {
      fetchTrajetDetails();
    } else {
      setLoading(false);
    }
  }, [trajetId]);

  const createVehicleLayout = () => {
    let layout = [];
    
    if (totalPlaces === '20') {
      layout = [
        [1, 0, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 0, 10],
        [11, 12, 0, 13],
        [14, 15, 0, 16],
        [17, 18, 19, 20]
      ];
    } else if (totalPlaces === '22') {
      layout = [
        [1, 0, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 0],
        [11, 12, 13, 14],
        [15, 16, 17, 18],
        [19, 20, 21, 22]
      ];
    } else {
      layout = [[1, 2, 3]]; // Driver row
      const remainingSeats = parseInt(totalPlaces) - 3;
      const fullRows = Math.floor(remainingSeats / 4);
      
      for (let i = 0; i < fullRows; i++) {
        layout.push([4 + i * 4, 5 + i * 4, 6 + i * 4, 7 + i * 4]);
      }
      
      const remainingSeatsFinal = remainingSeats % 4;
      if (remainingSeatsFinal > 0) {
        const lastRow = Array.from(
          { length: remainingSeatsFinal },
          (_, i) => parseInt(totalPlaces) - remainingSeatsFinal + i + 1
        );
        layout.push(lastRow);
      }
    }
    
    return layout;
  };

  const vehicleLayout = createVehicleLayout();

  const handleSeatClick = (seatNumber) => {
    if (seatNumber === 1 || reservedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else if (selectedSeats.length < maxSeats) {
      setSelectedSeats([...selectedSeats, seatNumber].sort((a, b) => a - b));
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

  const handleReservation = async () => {
    if (selectedSeats.length === 0) {
      alert("Veuillez sélectionner au moins un siège");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(
        'https://vital-lizard-adequately.ngrok-free.app/api/create-book/',
        {
          trajet: trajetId,
          seats_reserved: selectedSeats,
          places_researved: selectedSeats.length
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setReservedSeats([...reservedSeats, ...selectedSeats]);
      setSelectedSeats([]);
      
      alert(`Réservation réussie pour ${selectedSeats.length} siège(s)`);
      router.push({
        pathname: "/my-tickets",
        params: { refresh: Date.now().toString() }, // Add refresh timestamp
      });
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.non_field_errors?.[0] || 
                         'Une erreur est survenue lors de la réservation';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSeat = ({ item: seatNumber }) => {
    if (seatNumber === 0) {
      return <View className="w-14 h-14 m-2" />;
    }

    return (
      <TouchableOpacity
        onPress={() => handleSeatClick(seatNumber)}
        disabled={seatNumber === 1 || reservedSeats.includes(seatNumber)}
        className={`w-14 h-14 rounded-lg flex items-center justify-center m-2 ${getSeatStyle(
          seatNumber
        )}`}
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold">
          {seatNumber === 1 ? (
            <Feather name="user" size={20} color="white" />
          ) : (
            seatNumber
          )}
        </Text>
      </TouchableOpacity>
    );
  };

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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity
          onPress={() => {
            const formattedDate = new Date(date).toISOString().split('T')[0];
            router.push({
              pathname: "/availableTaxibe",
              params: { from, to, date: formattedDate },
            });
          }}
          className="bg-gray-200 p-2 rounded-full"
        >
          <Feather name="arrow-left" size={24} color="gray" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">
          {marque} - {totalPlaces} places - {categorie} 
        </Text>
        <View className="w-10" />
      </View>

      <FlatList
        data={vehicleLayout}
        renderItem={renderRow}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {/* Légende */}
            <View className="bg-white rounded-xl shadow-md p-4 mx-4 mt-6 mb-4">
              <View className="flex-row flex-wrap justify-between">
                {[
                  ["bg-green-500", "Disponible"],
                  ["bg-red-500", "Réservé"],
                  ["bg-blue-500", "Sélectionné"],
                  ["bg-gray-800", "Conducteur"]
                ].map(([color, label]) => (
                  <View key={label} className="flex-row items-center mb-2">
                    <View className={`w-4 h-4 ${color} rounded mr-2`} />
                    <Text className="text-sm text-gray-700">{label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Résumé Réservation */}
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
                      <Text className="font-semibold text-gray-800">{price} Ar</Text>
                    </View>
                  ))}
                  <View className="border-t border-gray-200 pt-2">
                    <View className="flex-row justify-between">
                      <Text className="font-bold text-gray-800">Total :</Text>
                      <Text className="font-bold text-gray-800">
                        {selectedSeats.length * price} Ar
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <Text className="text-center text-gray-500 py-4">
                  Sélectionnez vos sièges
                </Text>
              )}
            </View>

            {/* Bouton Réserver */}
            <TouchableOpacity
              onPress={handleReservation}
              disabled={isSubmitting}
              className={`mx-4 mb-6 rounded-lg p-4 ${
                isSubmitting ? "bg-gray-400" : "bg-green-600"
              }`}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isSubmitting ? "Réservation en cours..." : "Réserver sièges"}
              </Text>
            </TouchableOpacity>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default SelectSeats;