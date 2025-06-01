import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import ViewShot from "react-native-view-shot";
import Modal from "react-native-modal";
import Animated, {
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

const MyTickets = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const qrRef = useRef();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.get(
          "https://vital-lizard-adequately.ngrok-free.app/api/my-book/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Filter out reservations with missing status
        const validReservations = response.data.filter(
          (reservation) => reservation.status !== undefined
        );
        setReservations(validReservations);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des réservations:", err);
        setError("Une erreur est survenue lors de la récupération de vos réservations.");
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleDownload = async (reservation, ref) => {
    try {
      const uri = await ref.current.capture();
      const fileUri = `${FileSystem.cacheDirectory}qr_code_${reservation.id}.png`;
      await FileSystem.copyAsync({ from: uri, to: fileUri });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          dialogTitle: "Partager le QR Code",
          mimeType: "image/png",
        });
      } else {
        alert("Le partage n'est pas disponible sur cet appareil.");
      }
    } catch (err) {
      console.error("Erreur lors de la capture ou du partage du QR:", err);
      alert("Erreur lors du téléchargement du QR Code. Veuillez réessayer.");
    }
  };

  const handlePayment = (reservationId) => {
    alert(`Paiement pour la réservation ${reservationId}`);
  };

  const groupReservationsByStatus = () => {
    const grouped = { paid: [], unpaid: [] };
    reservations.forEach((reservation) => {
      const statusGroup = reservation.status === "completed" ? "paid" : "unpaid";
      grouped[statusGroup].push(reservation);
    });
    return grouped;
  };

  const getStatusColor = (status) => {
    // Handle undefined or null status
    if (!status) {
      return "bg-gray-100 text-gray-800";
    }
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? "Date non disponible"
      : d.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const renderReservationItem = ({ item }) => (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className="bg-white rounded-xl shadow-md mx-4 mb-6 overflow-hidden"
    >
      <View className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <FontAwesome name="ticket" size={16} color="white" />
          <Text className="text-white text-sm font-semibold">
            Billet #{item.id}
          </Text>
        </View>
        <View
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            item.status
          )}`}
        >
          <Text>{item.status === "completed" ? "Payé" : "Non payé"}</Text>
        </View>
      </View>
      <View className="p-3 space-y-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="place" size={16} color="#10B981" />
            <Text className="text-sm font-medium text-gray-700">
              {item.trajet?.route.ville_depart} → {item.trajet?.route.ville_arrive}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between text-xs text-gray-600">
          <Text>{formatDate(item.trajet?.date)}</Text>
          <Text>Sièges: {item.seats_reserved?.join(", ") || "Aucun"}</Text>
        </View>
        <View className="flex-row justify-between text-xs text-gray-600">
          <Text>Places: {item.places_researved || 0}</Text>
          <Text>Total: {(item.places_researved || 0) * 10000} Ar</Text>
        </View>
      </View>
      <View className="flex-row justify-around border-t border-gray-100 bg-gray-50 py-2">
        <TouchableOpacity
          onPress={() => setSelectedTicket(item)}
          className="flex-row items-center gap-1"
        >
          <MaterialCommunityIcons name="qrcode" size={16} color="#2563EB" />
          <Text className="text-blue-600 text-xs font-medium">QR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedDetails(item)}
          className="flex-row items-center gap-1"
        >
          <MaterialIcons name="info-outline" size={16} color="#4B5563" />
          <Text className="text-gray-600 text-xs font-medium">Détails</Text>
        </TouchableOpacity>
        {item.status !== "completed" && (
          <TouchableOpacity
            onPress={() => handlePayment(item.id)}
            className="flex-row items-center gap-1"
          >
            <MaterialIcons name="payment" size={16} color="#10B981" />
            <Text className="text-green-600 text-xs font-medium">Payer</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => handleDownload(item, qrRef)}
          className="flex-row items-center gap-1"
        >
          <Feather name="download" size={16} color="#10B981" />
          <Text className="text-green-600 text-xs font-medium">PDF</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const groupedReservations = groupReservationsByStatus();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Chargement de vos réservations...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row justify-between items-center p-4 bg-white shadow-md">
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="bg-gray-200 p-2 rounded-full"
        >
          <Feather name="arrow-left" size={24} color="gray" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-green-700">Mes Billets</Text>
        <FontAwesome name="ticket" size={24} color="gray" />
      </View>

      {error ? (
        <View className="flex-1 justify-center items-center p-4">
          <MaterialIcons name="error-outline" size={50} color="red" />
          <Text className="text-red-500 text-center mt-2">{error}</Text>
        </View>
      ) : reservations.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <MaterialIcons name="local-activity" size={50} color="gray" />
          <Text className="text-gray-500 text-center mt-2">
            Vous n'avez aucune réservation pour le moment.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="bg-green-500 p-3 rounded-lg mt-4"
          >
            <Text className="text-white font-semibold">Réserver un trajet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {["paid", "unpaid"].map(
            (statusGroup) =>
              groupedReservations[statusGroup].length > 0 && (
                <View key={statusGroup} className="space-y-4">
                  <Text className="text-lg font-semibold text-gray-800 mx-4 mt-4">
                    {statusGroup === "paid" ? "Réservations payées" : "Réservations non payées"}
                  </Text>
                  <FlatList
                    data={groupedReservations[statusGroup]}
                    renderItem={renderReservationItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingHorizontal: 4 }}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )
          )}
        </ScrollView>
      )}

      <Modal
        isVisible={!!selectedTicket}
        onBackdropPress={() => setSelectedTicket(null)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        className="flex items-center justify-center"
      >
        <View className="bg-white p-6 rounded-xl max-w-sm w-full">
          <Text className="text-lg font-semibold mb-4 text-gray-800">
            Code QR du billet - #{selectedTicket?.id}
          </Text>
          <ViewShot ref={qrRef} options={{ format: "png", quality: 1.0 }}>
            <QRCode
              value={`Reservation:${selectedTicket?.id};Trajet:${selectedTicket?.trajet?.id};Seats:${selectedTicket?.seats_reserved?.join(",")}`}
              size={180}
              color="black"
              backgroundColor="white"
              className="mx-auto"
            />
          </ViewShot>
          <TouchableOpacity
            onPress={() => setSelectedTicket(null)}
            className="mt-4 bg-gray-200 p-2 rounded-lg"
          >
            <Text className="text-gray-800 text-center font-medium">Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={!!selectedDetails}
        onBackdropPress={() => setSelectedDetails(null)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        className="flex items-center justify-center"
      >
        <View className="bg-white p-6 rounded-xl max-w-sm w-full">
          <Text className="text-lg font-semibold mb-4 text-center text-gray-800">
            Détails du billet #{selectedDetails?.id}
          </Text>
          <ScrollView className="space-y-2">
            <View className="flex-row items-center gap-2 mb-2">
              <FontAwesome name="bus" size={16} color="#2563EB" />
              <Text className="text-sm text-gray-600">
                Taxi-brousse: {selectedDetails?.trajet?.taxibe.marque}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialCommunityIcons name="ticket-confirmation" size={16} color="#4B5563" />
              <Text className="text-sm text-gray-600">
                Immatriculation: {selectedDetails?.trajet?.taxibe.matricule || "Non disponible"}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <Feather name="user" size={16} color="#2563EB" />
              <Text className="text-sm text-gray-600">
                Utilisateur: {selectedDetails?.user.username}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="category" size={16} color="#2563EB" />
              <Text className="text-sm text-gray-600">
                Catégorie: {selectedDetails?.trajet?.taxibe.categorie}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <Feather name="user" size={16} color="#4B5563" />
              <Text className="text-sm text-gray-600">
                Chauffeur: {selectedDetails?.trajet?.taxibe.chauffeur}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="payment" size={16} color="#10B981" />
              <Text className="text-sm text-gray-600">
                Total: {(selectedDetails?.places_researved || 0) * selectedDetails?.trajet.price}{" "} Ar
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <View
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  selectedDetails?.status
                )}`}
              >
                <Text>Statut: {selectedDetails?.status === "completed" ? "Payé" : "Non payé"}</Text>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => setSelectedDetails(null)}
            className="mt-4 bg-gray-200 p-2 rounded-lg"
          >
            <Text className="text-gray-800 text-center font-medium">Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MyTickets;