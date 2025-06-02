import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Feather, 
  MaterialIcons, 
  FontAwesome, 
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5
} from "@expo/vector-icons";
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
import bgImage from '../../assets/bghome3.png';


const MyTickets = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReservationForPayment, setSelectedReservationForPayment] = useState(null);
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

  const handlePaymentInitiation = (reservation) => {
    setSelectedReservationForPayment(reservation);
    setShowPaymentModal(true);
  };

  const handlePayment = (method) => {
    setShowPaymentModal(false);
    alert(`Paiement ${method} initié pour la réservation #${selectedReservationForPayment.id}`);
    // Ici vous intégreriez le vrai processus de paiement
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
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
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

  // Méthodes de paiement avec icônes et couleurs
  const paymentMethods = [
    { 
      id: 'mvola', 
      name: 'MVola', 
      icon: <MaterialCommunityIcons name="cellphone" size={32} color="yellow" />,
      color: 'yellow'
    },
    { 
      id: 'orange', 
      name: 'Orange Money', 
      icon: <FontAwesome5 name="money-bill-wave" size={30} color="#ff7900" />,
      color: '#ff7900'
    },
    { 
      id: 'airtel', 
      name: 'Airtel Money', 
      icon: <Ionicons name="phone-portrait" size={30} color="#e4002b" />,
      color: '#e4002b'
    },
    { 
      id: 'card', 
      name: 'Carte de crédit', 
      icon: <FontAwesome name="credit-card" size={30} color="#6772e5" />,
      color: '#6772e5'
    },
  ];

  const renderReservationItem = ({ item }) => (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className="bg-white rounded-2xl shadow-lg mx-4 mb-6 overflow-hidden border border-gray-100"
    >
      <View className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <FontAwesome name="ticket" size={18} color="white" />
          <Text className="text-white text-base font-bold">
            Billet #{item.id}
          </Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}
        >
          <Text className="font-medium">
            {item.status === "completed" ? "Payé" : "Non payé"}
          </Text>
        </View>
      </View>
      <View className="p-4 space-y-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="place" size={18} color="#10B981" />
            <Text className="text-base font-semibold text-gray-800">
              {item.trajet?.route.ville_depart} → {item.trajet?.route.ville_arrive}
            </Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Feather name="calendar" size={16} color="#6B7280" />
            <Text className="text-gray-600">{formatDate(item.trajet?.date)}</Text>
          </View>
          
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="seat" size={18} color="#6B7280" />
            <Text className="text-gray-600">
              Siège(s): {item.seats_reserved?.join(", ") || "Aucun"}
            </Text>
          </View>
        </View>
        
        <View className="flex-row justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="people" size={18} color="#6B7280" />
            <Text className="text-gray-600">Places: {item.places_researved || 0}</Text>
          </View>
          
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="attach-money" size={18} color="#6B7280" />
            <Text className="text-gray-600 font-semibold">
              Total: {(item.places_researved || 0) * item.trajet.price} Ar
            </Text>
          </View>
        </View>
      </View>
      
      <View className="flex-row justify-around border-t border-gray-100 bg-gray-50 py-3">
        <TouchableOpacity
          onPress={() => setSelectedTicket(item)}
          className="items-center"
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="#3B82F6" />
          <Text className="text-blue-600 text-xs font-medium mt-1">QR Code</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setSelectedDetails(item)}
          className="items-center"
        >
          <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
          <Text className="text-gray-600 text-xs font-medium mt-1">Détails</Text>
        </TouchableOpacity>
        
        {item.status !== "completed" && (
          <TouchableOpacity
            onPress={() => handlePaymentInitiation(item)}
            className="items-center"
          >
            <MaterialIcons name="payment" size={24} color="#10B981" />
            <Text className="text-green-600 text-xs font-medium mt-1">Payer</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          onPress={() => handleDownload(item, qrRef)}
          className="items-center"
        >
          <Feather name="download" size={24} color="#10B981" />
          <Text className="text-green-600 text-xs font-medium mt-1">Télécharger</Text>
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
    <ImageBackground
    source = {bgImage}
    style = {{flex: 1}}
    resizeMode="cover"> 
    <SafeAreaView className="flex-1 ">
      <View className="flex-row justify-between items-center p-5 shadow-sm">
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="bg-gray-100 p-2 rounded-full"
        >
          <Feather name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Mes billets</Text>
        <FontAwesome name="ticket" size={24} color="red" />
      </View>

      {error ? (
        <View className="flex-1 justify-center items-center p-4">
          <MaterialIcons name="error-outline" size={50} color="#EF4444" />
          <Text className="text-red-500 text-center mt-4 text-lg">{error}</Text>
        </View>
      ) : reservations.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <MaterialIcons name="local-activity" size={60} color="#9CA3AF" />
          <Text className="text-gray-500 text-center mt-4 text-lg">
            Vous n'avez aucune réservation pour le moment.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="bg-green-500 p-4 rounded-xl mt-6 shadow-md"
          >
            <Text className="text-white font-bold text-base">Réserver un trajet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          {["paid", "unpaid"].map(
            (statusGroup) =>
              groupedReservations[statusGroup].length > 0 && (
                <View key={statusGroup} className="space-y-4 mt-4">
                  <Text className="text-lg font-bold text-gray-800 mx-4 mb-2">
                    {statusGroup === "paid" 
                      ? "Réservations payées" 
                      : "Réservations en attente de paiement"}
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

      {/* Modal QR Code */}
      <Modal
        isVisible={!!selectedTicket}
        onBackdropPress={() => setSelectedTicket(null)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.7}
      >
        <View className="bg-white p-6 rounded-2xl items-center">
          <Text className="text-xl font-bold mb-4 text-gray-800">
            Code QR du billet #{selectedTicket?.id}
          </Text>
          <ViewShot ref={qrRef} options={{ format: "png", quality: 1.0 }}>
            <View className="bg-white p-4 rounded-lg border border-gray-200">
              <QRCode
                value={`Reservation:${selectedTicket?.id};Trajet:${selectedTicket?.trajet?.id};Seats:${selectedTicket?.seats_reserved?.join(",")}`}
                size={200}
                color="black"
                backgroundColor="white"
              />
            </View>
          </ViewShot>
          <Text className="text-gray-600 mt-4 text-center">
            Présentez ce code QR au chauffeur pour valider votre billet
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedTicket(null)}
            className="mt-6 bg-blue-500 w-full py-3 rounded-xl"
          >
            <Text className="text-white text-center font-bold">Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal Détails */}
      <Modal
        isVisible={!!selectedDetails}
        onBackdropPress={() => setSelectedDetails(null)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.7}
      >
        <View className="bg-white p-6 rounded-t-3xl max-w-sm w-full mx-auto">
          <Text className="text-xl font-bold mb-4 text-center text-gray-800">
            Détails du billet #{selectedDetails?.id}
          </Text>
          <ScrollView className="space-y-3 max-h-80">
            <DetailItem 
              icon={<FontAwesome name="bus" size={20} color="#3B82F6" />}
              label="Taxi-brousse" 
              value={selectedDetails?.trajet?.taxibe.marque}
            />
            
            <DetailItem 
              icon={<MaterialCommunityIcons name="license" size={20} color="#6B7280" />}
              label="Immatriculation" 
              value={selectedDetails?.trajet?.taxibe.matricule || "Non disponible"}
            />
            
            <DetailItem 
              icon={<Feather name="user" size={20} color="#3B82F6" />}
              label="Passager" 
              value={selectedDetails?.user.username}
            />
            
            <DetailItem 
              icon={<MaterialIcons name="category" size={20} color="#3B82F6" />}
              label="Catégorie" 
              value={selectedDetails?.trajet?.taxibe.categorie}
            />
            
            <DetailItem 
              icon={<MaterialCommunityIcons name="steering" size={20} color="#6B7280" />}
              label="Chauffeur" 
              value={selectedDetails?.trajet?.taxibe.chauffeur}
            />
            
            <DetailItem 
              icon={<MaterialIcons name="attach-money" size={20} color="#10B981" />}
              label="Total" 
              value={`${(selectedDetails?.places_researved || 0) * selectedDetails?.trajet.price} Ar`}
            />
            
            <View className="flex-row items-center gap-3 mt-2">
              <MaterialIcons name="event" size={20} color="#6B7280" />
              <Text className="text-gray-700 font-medium">Date:</Text>
              <Text className="text-gray-600">
                {formatDate(selectedDetails?.trajet?.date)} à {selectedDetails?.trajet.time}
              </Text>
            </View>
            
            <View className="flex-row items-center gap-3 mt-2">
              <View className={`px-3 py-1 rounded-full ${getStatusColor(selectedDetails?.status)}`}>
                <Text className="font-medium">
                  Statut: {selectedDetails?.status === "completed" ? "Payé" : "En attente de paiement"}
                </Text>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => setSelectedDetails(null)}
            className="mt-6 bg-gray-200 py-3 rounded-xl"
          >
            <Text className="text-gray-800 text-center font-bold">Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal Paiement */}
      <Modal
        isVisible={showPaymentModal}
        onBackdropPress={() => setShowPaymentModal(false)}
        animationIn="bounceIn"
        animationOut="bounceOut"
        backdropOpacity={0.7}
      >
        <View className="bg-white p-6 rounded-2xl">
          <Text className="text-xl font-bold mb-2 text-center text-gray-800">
            Paiement du billet #{selectedReservationForPayment?.id}
          </Text>
          <Text className="text-lg font-semibold text-center text-gray-600 mb-6">
            Total: {(selectedReservationForPayment?.places_researved || 0) * selectedReservationForPayment?.trajet.price} Ar
          </Text>
          
          <Text className="text-base font-medium text-gray-700 mb-4">
            Choisissez votre méthode de paiement:
          </Text>
          
          <View className="flex-row flex-wrap justify-between">
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => handlePayment(method.name)}
                className="items-center w-1/2 mb-6"
              >
                <View className="bg-gray-100 p-4 rounded-2xl items-center justify-center w-28 h-28">
                  {method.icon}
                </View>
                <Text className="font-medium mt-2" style={{ color: method.color }}>
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            onPress={() => setShowPaymentModal(false)}
            className="mt-2 border border-gray-300 py-3 rounded-xl"
          >
            <Text className="text-gray-700 text-center font-medium">Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
    </ImageBackground>
  );
};

// Composant de détails
const DetailItem = ({ icon, label, value }) => (
  <View className="flex-row items-center gap-3 mb-2">
    {icon}
    <Text className="text-gray-700 font-medium">{label}:</Text>
    <Text className="text-gray-600 flex-1">{value}</Text>
  </View>
);

export default MyTickets;