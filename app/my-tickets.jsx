import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

// Static ticket image (replace with your asset)
import ticketImage from "../assets/robot.jpg"; // Placeholder

export default function MyTickets() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  // Static reservation data
  const reservation = {
    id: "TAX123",
    from: "Antsirabe",
    to: "Antananarivo",
    date: "March 15, 2025",
    time: "08:00 AM",
    marque: "Toyota HiAce",
    seats: [4, 5, 6],
    totalPrice: 30000, // in Ariary (Ar)
    cooperative: "Coopérative Nord",
    status: "Pending",
  };

  const paymentMethods = [
    { id: "mvola", name: "MVola", icon: "phone" },
    { id: "orange", name: "Orange Money", icon: "credit-card" },
    { id: "airtel", name: "Airtel Money", icon: "smartphone" },
    { id: "visa", name: "Visa", icon: "credit-card" },
  ];

  const minimumPayment = reservation.totalPrice * 0.3; // 30% of total

  const handlePaymentSelection = (methodId) => {
    setSelectedPayment(methodId);
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) {
      alert("Veuillez sélectionner un mode de paiement");
      return;
    }
    // Simulate payment success
    setIsPaid(true);
  };

  const handleDownloadTicket = () => {
    alert("Téléchargement du ticket en cours...");
    // Implement actual download logic here
  };

  const handleShareTicket = () => {
    alert("Partage du ticket en cours...");
    // Implement actual share logic here (e.g., with expo-sharing)
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        {/* Header */}
        <Animated.View
          entering={FadeInUp.duration(500)}
          className="pt-12 pb-6 px-4 bg-green-700 flex-row items-center"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white">
            Mes Réservations
          </Text>
        </Animated.View>

        {/* Reservation Details */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          className="mx-4 mt-6 bg-white rounded-xl p-4 shadow-md"
        >
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Détails de la Réservation #{reservation.id}
          </Text>
          <View className="space-y-2">
            <Text className="text-gray-600">
              <Feather name="map-pin" size={16} color="#10B981" />{" "}
              {reservation.from} → {reservation.to}
            </Text>
            <Text className="text-gray-600">
              <Feather name="calendar" size={16} color="#10B981" />{" "}
              {reservation.date} à {reservation.time}
            </Text>
            <Text className="text-gray-600">
              <Feather name="truck" size={16} color="#10B981" />{" "}
              {reservation.marque}
            </Text>
            <Text className="text-gray-600">
              <Feather name="users" size={16} color="#10B981" /> Sièges:{" "}
              {reservation.seats.join(", ")}
            </Text>
            <Text className="text-gray-600">
              <Feather name="home" size={16} color="#10B981" />{" "}
              {reservation.cooperative}
            </Text>
            <Text className="text-gray-800 font-semibold">
              Total: {reservation.totalPrice} Ar
            </Text>
          </View>
        </Animated.View>

        {/* Payment Instructions */}
        {!isPaid && (
          <Animated.View
            entering={FadeInDown.duration(500).delay(400)}
            className="mx-4 mt-6 bg-white rounded-xl p-4 shadow-md"
          >
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Paiement
            </Text>
            <Text className="text-gray-600 mb-4">
              Veuillez payer au moins 30% ({minimumPayment} Ar) pour compléter votre réservation.
            </Text>

            {/* Payment Methods */}
            <View className="space-y-3">
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => handlePaymentSelection(method.id)}
                  className={`flex-row items-center p-3 rounded-lg border-2 ${
                    selectedPayment === method.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={method.icon}
                    size={20}
                    color={selectedPayment === method.id ? "#10B981" : "gray"}
                  />
                  <Text
                    className={`ml-3 font-medium ${
                      selectedPayment === method.id
                        ? "text-green-700"
                        : "text-gray-700"
                    }`}
                  >
                    {method.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleConfirmPayment}
              disabled={!selectedPayment}
              className={`mt-4 p-3 rounded-lg flex-row items-center justify-center ${
                selectedPayment ? "bg-green-500" : "bg-gray-400"
              }`}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg mr-2">
                Confirmer le Paiement
              </Text>
              <Feather name="check" size={20} color="white" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Ticket and Confirmation */}
        {isPaid && (
          <Animated.View
            entering={FadeInDown.duration(500).delay(600)}
            className="mx-4 mt-6 space-y-6"
          >
            {/* Ticket Preview */}
            <View className="bg-white rounded-xl p-4 shadow-md">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Votre Ticket
              </Text>
              <Image
                source={ticketImage}
                className="w-full h-40 rounded-lg mb-4"
                resizeMode="cover"
              />
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={handleDownloadTicket}
                  className="flex-row items-center bg-green-500 p-2 rounded-lg"
                  activeOpacity={0.7}
                >
                  <Feather name="download" size={20} color="white" />
                  <Text className="text-white ml-2">Télécharger</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleShareTicket}
                  className="flex-row items-center bg-blue-500 p-2 rounded-lg"
                  activeOpacity={0.7}
                >
                  <Feather name="share-2" size={20} color="white" />
                  <Text className="text-white ml-2">Partager</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmation Message */}
            <View className="bg-green-50 rounded-xl p-4 shadow-md">
              <Text className="text-lg font-semibold text-green-700 mb-2">
                Réservation Confirmée !
              </Text>
              <Text className="text-gray-700">
                Votre réservation est complètement réservée. Veuillez arriver{" "}
                <Text className="font-bold">30 minutes avant le départ</Text> à la station de{" "}
                {reservation.cooperative} pour compléter la vérification.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/home")}
                className="mt-4 bg-green-500 p-3 rounded-lg flex-row items-center justify-center"
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold">Retour à l'Accueil</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}