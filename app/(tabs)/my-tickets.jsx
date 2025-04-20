import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import ViewShot from "react-native-view-shot";

const MyTickets = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const qrRef = useRef();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(
          'https://vital-lizard-adequately.ngrok-free.app/api/my-book/',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setReservations(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des réservations:', err);
        setError('Une erreur est survenue lors de la récupération de vos réservations.');
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);


const handleDownload = async (reservation, ref) => {
  try {
    const uri = await ref.current.capture();
    console.log("Captured URI:", uri);

    // Save the file to a temporary location
    const fileUri = `${FileSystem.cacheDirectory}qr_code_${reservation.id}.png`;
    await FileSystem.copyAsync({ from: uri, to: fileUri });
    console.log("Saved QR code to:", fileUri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        dialogTitle: 'Partager le QR Code',
        mimeType: 'image/png',
      });
      console.log("Shared QR code successfully");
    } else {
      alert('Le partage n\'est pas disponible sur cet appareil.');
    }
  } catch (err) {
    console.error("Erreur lors de la capture ou du partage du QR:", err);
    alert("Erreur lors du téléchargement du QR Code. Veuillez réessayer.");
  }
};


  const handleShare = async (reservation) => {
    try {
      const ticketDetails = {
        id: reservation.id,
        route: `${reservation.trajet?.route.ville_depart || 'N/A'} → ${reservation.trajet?.route.ville_arrive || 'N/A'}`,
        date: reservation.trajet?.date || 'N/A',
        taxi: reservation.trajet?.taxibe.marque || 'N/A',
        seats: reservation.seats_reserved?.join(", ") || 'None',
        total: (reservation.places_researved || 0) * 10000,
      };
      
      const message = `My Ticket #${ticketDetails.id}\nRoute: ${ticketDetails.route}\nDate: ${ticketDetails.date}\nTaxiBe: ${ticketDetails.taxi}\nSeats: ${ticketDetails.seats}\nTotal: ${ticketDetails.total} Ar`;
      
      // Create a temporary file to share
      const tempFileUri = `${FileSystem.cacheDirectory}temp_ticket_${reservation.id}.txt`;
      await FileSystem.writeAsStringAsync(tempFileUri, message);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(tempFileUri, {
          dialogTitle: 'Share Ticket Details',
          UTI: 'public.plain-text',
          mimeType: 'text/plain',
        });
      } else {
        alert('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing ticket:', error);
      alert('Failed to share ticket. Please try again.');
    }
  };

  const handlePayment = (reservationId) => {
    // Placeholder for payment functionality
    alert(`Paiement pour la réservation ${reservationId}`);
  };

  const renderReservationItem = ({ item }) => (
    <View className="bg-white rounded-xl shadow-md p-3 mx-4 mb-4 border border-gray-200">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-gray-800">
          Réservation #{item.id}
        </Text>
        <Text className={`text-xs font-semibold ${item.payment_status === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
          {item.payment_status === 'paid' ? 'Payé' : 'Non payé'}
        </Text>
      </View>
      <View className="mb-2">
        <Text className="text-sm text-gray-700">Trajet: {item.trajet?.route.ville_depart || 'N/A'} → {item.trajet?.route.ville_arrive || 'N/A'}</Text>
        <Text className="text-sm text-gray-700">Date: {item.trajet?.date || 'N/A'}</Text>
        <Text className="text-sm text-gray-700">TaxiBe: {item.trajet?.taxibe.marque || 'N/A'}</Text>
        <Text className="text-sm text-gray-700">Sièges: {item.seats_reserved && item.seats_reserved.length > 0
              ? item.seats_reserved.join(", ")
              : "Aucun"}</Text>
        <Text className="text-sm font-semibold text-gray-800">Total: {(item.places_researved || 0) * 10000} Ar</Text>
      </View>
      <View className="flex-row justify-center mb-2">
        <ViewShot ref={qrRef} options={{ format: "png", quality: 1.0 }}>
          <QRCode
            value={`Reservation:${item.id};Trajet:${item.trajet?.id || 'N/A'};Seats:${Array.isArray(item.seats_reserved) ? item.seats_reserved.join(',') : 'N/A'}`}
            size={120}
            color="black"
            backgroundColor="white"
          />
        </ViewShot>
      </View>
      <View className="flex-row justify-between">
        <TouchableOpacity onPress={() => handleDownload(item, qrRef)}
          className="bg-blue-500 p-2 rounded-lg flex-1 mx-1"
        >
          <Text className="text-white text-center text-sm font-semibold">Télécharger</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleShare(item)}
          className="bg-green-500 p-2 rounded-lg flex-1 mx-1"
        >
          <Text className="text-white text-center text-sm font-semibold">Partager</Text>
        </TouchableOpacity>
        {item.payment_status !== 'paid' && (
          <TouchableOpacity
            onPress={() => handlePayment(item.id)}
            className="bg-orange-500 p-2 rounded-lg flex-1 mx-1"
          >
            <Text className="text-white text-center text-sm font-semibold">Payer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-row justify-between items-center p-4 bg-white shadow-md">
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="bg-gray-200 p-2 rounded-full"
          >
            <Feather name="arrow-left" size={24} color="gray" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-green-700">Mes Billets</Text>
          <View className="w-10" />
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
          <FlatList
            data={reservations}
            renderItem={renderReservationItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyTickets; 