import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Image,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Feather,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import QRCode from "react-native-qrcode-svg";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import ViewShot from "react-native-view-shot";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeOut, FadeInUp } from "react-native-reanimated";
import { StripeProvider, CardField, useStripe } from "@stripe/stripe-react-native";
import bgImage from "../../assets/bghome3.png";
import mvolaImage from "../../assets/mvola.jpg";
import orangeImage from "../../assets/orange.jpg";
import airtelImage from "../../assets/airtel.png";

const STRIPE_PUBLISHABLE_KEY = "pk_test_51RTdTRCBd52w0wnHsSRtMDUv6rPR7p4Te073pl9B2K5oGmbCVwrqtcHK9ihKIjX7RK6XjRcevLJv95gO0tU4L4iQ00u460tD5F";

const MyTickets = () => {
  const router = useRouter();
  const { refresh } = useLocalSearchParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [retryLoading, setRetryLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [selectedReservationForPayment, setSelectedReservationForPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const qrRef = useRef();
  const { confirmPayment } = useStripe();

  const CACHE_KEY = "cached_reservations";
  const RETRY_INTERVAL = 10000;

  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        setError("Veuillez vous connecter pour voir vos réservations.");
        setLoading(false);
        setRefreshing(false);
        return;
      }
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
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(validReservations));
      setError("");
      setLoading(false);
      setRetryLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des réservations:", err);
      setError("Impossible de récupérer les réservations. Vérifiez votre connexion.");
      setLoading(false);
      setRetryLoading(false);
      setRefreshing(false);
    }
  };

  const loadCachedReservations = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setReservations(JSON.parse(cached));
        setError("");
        setLoading(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erreur lors du chargement des réservations en cache:", err);
      return false;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
  };

  useEffect(() => {
    let retryInterval;

    const handleNetworkChange = async (state) => {
      setIsConnected(state.isConnected);
      setRetryLoading(false);

      if (state.isConnected) {
        setError("");
        setLoading(true);
        await fetchReservations();
      } else {
        const hasCache = await loadCachedReservations();
        if (!hasCache) {
          setError("Connexion perdue. Aucune donnée en cache disponible.");
        } else {
          setError("Connexion perdue. Affichage des données en cache.");
        }
        retryInterval = setInterval(async () => {
          const netInfo = await NetInfo.fetch();
          if (netInfo.isConnected) {
            setRetryLoading(true);
            await fetchReservations();
            clearInterval(retryInterval);
          }
        }, RETRY_INTERVAL);
      }
    };

    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    loadCachedReservations().then((hasCache) => {
      if (!hasCache) setLoading(true);
    });

    return () => {
      unsubscribe();
      if (retryInterval) clearInterval(retryInterval);
    };
  }, [refresh]);

  const generateTicketHtml = (reservation) => {
    const cooperative = {
      nom: reservation.trajet?.taxibe?.cooperative?.nom || "Inconnu",
      adresse: reservation.trajet?.taxibe?.cooperative?.adresse || "Non disponible",
      contact: reservation.trajet?.taxibe?.cooperative?.contact || "Non disponible",
    };

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { background-color: #2563eb; padding: 15px; color: white; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0; font-size: 12px; }
            .section { margin: 20px 0; }
            .section h2 { color: #2563eb; font-size: 18px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #2563eb; color: white; }
            .footer { margin-top: 20px; font-size: 10px; color: #666; text-align: center; }
            .instructions { margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Billet de voyage - TaxiBe</h1>
            <p>Coopérative: ${cooperative.nom}</p>
            <p>Adresse: ${cooperative.adresse}</p>
            <p>Contact: ${cooperative.contact}</p>
          </div>
          <div class="section">
            <h2>Informations du client</h2>
            <p><strong>Nom:</strong> ${reservation.user?.username || "Non disponible"}</p>
            <p><strong>Email:</strong> ${reservation.user?.email || "Non disponible"}</p>
          </div>
          <div class="section">
            <h2>Informations du trajet</h2>
            <p><strong>Trajet:</strong> ${reservation.trajet?.route.ville_depart} à ${reservation.trajet?.route.ville_arrive}</p>
            <p><strong>Date:</strong> ${formatDate(reservation.trajet?.date)}</p>
            <p><strong>Heure:</strong> ${reservation.trajet?.time || "Non disponible"}</p>
            <p><strong>Prix total:</strong> ${(reservation.places_researved || 0) * reservation.trajet.price} Ar</p>
          </div>
          <table class="table">
            <tr><th>Champ</th><th>Détails</th></tr>
            <tr><td>Identifiant du billet</td><td>${reservation.id}</td></tr>
            <tr><td>Taxi-brousse</td><td>${reservation.trajet?.taxibe.marque || "Non disponible"}</td></tr>
            <tr><td>Immatriculation</td><td>${reservation.trajet?.taxibe.matricule || "Non disponible"}</td></tr>
            <tr><td>Catégorie</td><td>${reservation.trajet?.taxibe.categorie || "Non disponible"}</td></tr>
            <tr><td>Chauffeur</td><td>${reservation.trajet?.taxibe.chauffeur || "Non disponible"}</td></tr>
            <tr><td>Places réservées</td><td>${reservation.places_researved || 0}</td></tr>
            <tr><td>Numéros de siège</td><td>${reservation.seats_reserved?.join(", ") || "Aucun"}</td></tr>
            <tr><td>Date de réservation</td><td>${formatDate(reservation.date_created)}</td></tr>
          </table>
          <div class="instructions">
            <p><strong>Instructions:</strong></p>
            <p>Veuillez arriver 30 minutes avant le départ pour la vérification du billet à la gare routière ou au bureau de la coopérative.</p>
          </div>
          <div class="footer">
            <p>Généré le ${new Date().toLocaleDateString("fr-FR")}</p>
            <p>© 2025 TaxiBe. Tous droits réservés.</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleDownload = async (reservation) => {
    try {
      const html = generateTicketHtml(reservation);
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: "Partager le billet PDF",
          mimeType: "application/pdf",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Erreur", "Le partage n'est pas disponible sur cet appareil.");
      }
    } catch (err) {
      console.error("Erreur lors de la génération ou du partage du PDF:", err);
      Alert.alert("Erreur", "Erreur lors du téléchargement du billet PDF. Veuillez réessayer.");
    }
  };

  const sendTicketEmail = async (reservation) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const html = generateTicketHtml(reservation);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const formData = new FormData();
      formData.append("ticket_id", reservation.id);
      formData.append("email", reservation.user?.email || "Non disponible");
      formData.append("pdf", {
        uri,
        name: `billet-${reservation.id}.pdf`,
        type: "application/pdf",
      });

      await axios.post(
        "https://vital-lizard-adequately.ngrok-free.app/api/send-ticket-email/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Alert.alert("Succès", "Le billet a été envoyé à votre adresse e-mail.");
    } catch (e) {
      console.error("Erreur lors de l'envoi de l'email:", e);
      Alert.alert(
        "Avertissement",
        "Le paiement a réussi, mais l'envoi du billet par email a échoué. Vous pouvez télécharger le billet manuellement."
      );
    }
  };

  const handlePaymentInitiation = (reservation) => {
    setSelectedReservationForPayment(reservation);
    setShowPaymentModal(true);
  };

  const handlePayment = async (method) => {
    if (method === "Carte de crédit") {
      setShowPaymentModal(false);
      setShowStripeModal(true);
      return;
    }
    setShowPaymentModal(false);
    Alert.alert(
      "Paiement",
      `Paiement ${method} initié pour la réservation #${selectedReservationForPayment.id}`
    );
    try {
      await sendTicketEmail(selectedReservationForPayment);
    } catch (e) {
      console.error("Erreur lors de l'envoi de l'email:", e);
    }
    await fetchReservations();
  };

  const handleStripePayment = async () => {
    if (!selectedReservationForPayment?.id || isNaN(parseInt(selectedReservationForPayment.id))) {
      Alert.alert("Erreur", "Identifiant de réservation invalide ou manquant.");
      return;
    }
    if (!selectedReservationForPayment.transaction_id) {
      Alert.alert("Erreur", "Aucune intention de paiement associée à cette réservation.");
      return;
    }

    setPaymentLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.post(
        "https://vital-lizard-adequately.ngrok-free.app/api/payments/confirm/",
        {
          booking_id: parseInt(selectedReservationForPayment.id),
          payment_intent_id: selectedReservationForPayment.transaction_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.client_secret) {
        const { error, paymentIntent } = await confirmPayment(response.data.client_secret, {
          paymentMethodType: "Card",
        });

        if (error) {
          Alert.alert("Erreur de paiement", error.message);
          setPaymentLoading(false);
          return;
        }

        const confirmResponse = await axios.post(
          "https://vital-lizard-adequately.ngrok-free.app/api/payments/confirm/",
          {
            booking_id: parseInt(selectedReservationForPayment.id),
            payment_intent_id: paymentIntent.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        try {
          await sendTicketEmail(selectedReservationForPayment);
        } catch (emailError) {
          console.error("Erreur lors de l'envoi de l'email:", emailError);
          Alert.alert(
            "Avertissement",
            "Le paiement a réussi, mais l'envoi du billet par email a échoué. Vous pouvez télécharger le billet manuellement."
          );
        }

        Alert.alert("Succès", confirmResponse.data.message || "Paiement réussi !");
        await fetchReservations();
        setShowStripeModal(false);
        setSelectedReservationForPayment(null);
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        error.response?.data?.error || error.message || "Une erreur est survenue lors de la confirmation du paiement."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const groupReservationsByStatus = () => {
    const grouped = { unpaid: [], paid: [] };
    reservations.forEach((reservation) => {
      const statusGroup = reservation.status === "completed" ? "paid" : "unpaid";
      grouped[statusGroup].push(reservation);
    });
    grouped.paid.sort((a, b) => b.id - a.id);
    grouped.unpaid.sort((a, b) => b.id - a.id);
    return [
      { title: "Réservations en attente de paiement", data: grouped.unpaid },
      { title: "Réservations payées", data: grouped.paid },
    ].filter((section) => section.data.length > 0);
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
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

  const SkeletonCard = () => (
    <View className="bg-[#f1f1f1] rounded-2xl shadow-lg mx-4 mb-6 overflow-hidden border border-gray-100 animate-pulse">
      <View className="bg-gray-300 p-4 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <View className="h-5 w-20 bg-gray-400 rounded" />
        </View>
        <View className="h-6 w-16 bg-gray-400 rounded-full" />
      </View>
      <View className="p-4 space-y-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="h-5 w-32 bg-gray-400 rounded" />
          </View>
        </View>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <View className="h-4 w-24 bg-gray-400 rounded" />
          </View>
          <View className="flex-row items-center gap-2">
            <View className="h-4 w-20 bg-gray-400 rounded" />
          </View>
        </View>
        <View className="flex-row justify-between">
          <View className="flex-row items-center gap-2">
            <View className="h-4 w-16 bg-gray-400 rounded" />
          </View>
          <View className="flex-row items-center gap-2">
            <View className="h-4 w-20 bg-gray-400 rounded" />
          </View>
        </View>
      </View>
      <View className="flex-row justify-around border-t border-gray-100 bg-gray-50 py-3">
        <View className="items-center">
          <View className="h-6 w-6 bg-gray-400 rounded" />
          <View className="h-3 w-12 bg-gray-400 rounded mt-1" />
        </View>
        <View className="items-center">
          <View className="h-6 w-6 bg-gray-400 rounded" />
          <View className="h-3 w-12 bg-gray-400 rounded mt-1" />
        </View>
        <View className="items-center">
          <View className="h-6 w-6 bg-gray-400 rounded" />
          <View className="h-3 w-12 bg-gray-400 rounded mt-1" />
        </View>
      </View>
    </View>
  );

  const paymentMethods = [
    {
      id: "mvola",
      name: "MVola",
      icon: <Image source={mvolaImage} style={{ width: 60, height: 60, resizeMode: "contain" }} />,
      color: "#f2e604",
      bgColor: "bg-yellow-50",
    },
    {
      id: "orange",
      name: "Orange Money",
      icon: <Image source={orangeImage} style={{ width: 60, height: 60, resizeMode: "contain" }} />,
      color: "#ff7900",
      bgColor: "bg-orange-50",
    },
    {
      id: "airtel",
      name: "Airtel Money",
      icon: <Image source={airtelImage} style={{ width: 60, height: 60, resizeMode: "contain" }} />,
      color: "#e4002b",
      bgColor: "bg-red-50",
    },
    {
      id: "card",
      name: "Carte de crédit",
      icon: <FontAwesome name="credit-card" size={40} color="#6772e5" />,
      color: "#6772e5",
      bgColor: "bg-blue-50",
    },
  ];

  const renderReservationItem = ({ item }) => (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className="bg-[#f1f1f1] rounded-2xl shadow-lg mx-4 mb-6 overflow-hidden border border-gray-100"
    >
      <View className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <FontAwesome name="ticket" size={18} color="black" />
          <Text className="text-base font-bold">Billet #{item.id}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
          <Text className="font-medium">
            {item.status === "completed" ? "Payé" : item.status === "failed" ? "Expiré" : "Non payé"}
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
            <Text className="text-gray-600">Siège(s): {item.seats_reserved?.join(", ") || "Aucun"}</Text>
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
      <View className="flex-row justify-around border-t border-gray-50 py-3">
        <TouchableOpacity onPress={() => setSelectedTicket(item)} className="items-center">
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="#3B82F6" />
          <Text className="text-blue-600 text-xs font-medium mt-1">QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedDetails(item)} className="items-center">
          <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
          <Text className="text-gray-600 text-xs font-medium mt-1">Détails</Text>
        </TouchableOpacity>
        {item.status === "pending" && (
          <TouchableOpacity onPress={() => handlePaymentInitiation(item)} className="items-center">
            <MaterialIcons name="payment" size={24} color="#10B981" />
            <Text className="text-green-600 text-xs font-medium mt-1">Payer</Text>
          </TouchableOpacity>
        )}
        {item.status === "completed" && (
          <TouchableOpacity onPress={() => handleDownload(item)} className="items-center">
            <Feather name="download" size={24} color="#10B981" />
            <Text className="text-green-600 text-xs font-medium mt-1">Télécharger</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  const renderSectionHeader = ({ item }) => (
    <Text className="text-lg font-bold text-gray-800 mx-4 mb-2">{item.title}</Text>
  );

  const groupedReservations = groupReservationsByStatus();

  if (!isConnected && reservations.length === 0) {
    return (
      <ImageBackground source={bgImage} style={{ flex: 1 }} resizeMode="cover">
        <SafeAreaView className="flex-1 mt-5">
          <Animated.View
            entering={FadeInUp.duration(500)}
            className="flex-row justify-between items-center py-3 px-4 bg-[#D32F2F] rounded-b-3xl shadow-md mb-4"
          >
            <Text className="text-2xl font-bold text-white">Mes billets</Text>
            <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
              <Feather
                name="refresh-ccw"
                size={24}
                color={refreshing ? "#9CA3AF" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </Animated.View>
          <View className="flex-1 justify-center items-center p-4">
            <MaterialIcons name="signal-wifi-off" size={50} color="#EF4444" />
            <Text className="text-red-500 text-center mt-4 text-lg">{error}</Text>
            {retryLoading && (
              <View className="flex-row items-center mt-4">
                <ActivityIndicator size="small" color="#10B981" />
                <Text className="text-gray-600 ml-2">Tentative de reconnexion...</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={async () => {
                setRetryLoading(true);
                await fetchReservations();
              }}
              className="bg-blue-500 p-4 rounded-xl mt-6 shadow-md"
            >
              <Text className="text-white font-bold text-base">Réessayer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <ImageBackground source={bgImage} style={{ flex: 1 }} resizeMode="cover">
        <SafeAreaView className="flex-1 mt-5">
          <Animated.View
            entering={FadeInUp.duration(500)}
            className="flex-row justify-between items-center py-3 px-4 bg-[#D32F2F] rounded-b-3xl shadow-md mb-4"
          >
            <Text className="text-2xl font-bold text-white">Mes billets</Text>
            <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
              <Feather
                name="refresh-ccw"
                size={24}
                color={refreshing ? "#9CA3AF" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </Animated.View>

          {error && reservations.length === 0 && (
            <View className="mx-4 mb-4 p-3 bg-red-100 rounded-xl">
              <Text className="text-red-500 text-center">{error}</Text>
            </View>
          )}

          {loading ? (
            <View className="flex-1">
              <FlatList
                data={[{ title: "Chargement", data: [1, 2, 3, 4] }]}
                renderItem={({ item }) => (
                  <View>
                    <Text className="text-lg font-bold text-gray-800 mx-4 mb-2">
                      Chargement des réservations...
                    </Text>
                    <FlatList
                      data={item.data}
                      renderItem={() => <SkeletonCard />}
                      keyExtractor={(id) => id.toString()}
                      contentContainerStyle={{ paddingHorizontal: 4 }}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                )}
                keyExtractor={(item) => item.title}
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
              />
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
            <View className="flex-1">
              {retryLoading && (
                <View className="flex-row items-center justify-center mb-4">
                  <ActivityIndicator size="small" color="#10B981" />
                  <Text className="text-gray-600 ml-2">Tentative de synchronisation...</Text>
                </View>
              )}
              <FlatList
                data={groupedReservations}
                renderItem={({ item }) => (
                  <View>
                    {renderSectionHeader({ item })}
                    <FlatList
                      data={item.data}
                      renderItem={renderReservationItem}
                      keyExtractor={(reservation) => reservation.id.toString()}
                      contentContainerStyle={{ paddingHorizontal: 4 }}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                )}
                keyExtractor={(item) => item.title}
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#10B981"
                    title="Actualisation..."
                    titleColor="#6B7280"
                  />
                }
              />
            </View>
          )}

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
                className="mt-6 bg-blue-500 w-full py-3 rounded-xl shadow-md"
              >
                <Text className="text-white text-center font-bold">Fermer</Text>
              </TouchableOpacity>
            </View>
          </Modal>

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
                      Statut: {selectedDetails?.status === "completed" ? "Payé" : selectedDetails?.status === "failed" ? "Expiré" : "En attente de paiement"}
                    </Text>
                  </View>
                </View>
              </ScrollView>
              <TouchableOpacity
                onPress={() => setSelectedDetails(null)}
                className="mt-6 bg-gray-200 py-3 rounded-xl shadow-md"
              >
                <Text className="text-gray-800 text-center font-bold">Fermer</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal
            isVisible={showPaymentModal}
            onBackdropPress={() => setShowPaymentModal(false)}
            animationIn="bounceIn"
            animationOut="bounceOut"
            backdropOpacity={0.7}
          >
            <View className="bg-white p-6 rounded-2xl shadow-xl">
              <Text className="text-2xl font-bold mb-2 text-center text-gray-800">
                Paiement du billet #{selectedReservationForPayment?.id}
              </Text>
              <Text className="text-lg font-semibold text-center text-gray-600 mb-6">
                Total: {(selectedReservationForPayment?.places_researved || 0) * selectedReservationForPayment?.trajet.price} Ar
              </Text>
              <Text className="text-base font-medium text-gray-700 mb-4 text-center">
                Choisissez votre méthode de paiement
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    onPress={() => handlePayment(method.name)}
                    className={`items-center w-[45%] mb-4 p-4 rounded-xl shadow-sm ${method.bgColor} border border-gray-200`}
                  >
                    <View className="bg-white p-3 rounded-lg shadow-sm">
                      {method.icon}
                    </View>
                    <Text className="font-semibold mt-2 text-center" style={{ color: method.color }}>
                      {method.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => setShowPaymentModal(false)}
                className="mt-4 bg-gray-200 py-3 rounded-xl shadow-md"
              >
                <Text className="text-gray-800 text-center font-bold">Annuler</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal
            isVisible={showStripeModal}
            onBackdropPress={() => setShowStripeModal(false)}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.7}
          >
            <View className="bg-white p-6 rounded-2xl shadow-xl">
              <Text className="text-2xl font-bold mb-2 text-center text-gray-800">
                Paiement par carte
              </Text>
              <Text className="text-lg font-semibold text-center text-gray-600 mb-2">
                Billet #{selectedReservationForPayment?.id}
              </Text>
              <Text className="text-base text-center text-gray-500 mb-6">
                Total: {(selectedReservationForPayment?.places_researved || 0) * selectedReservationForPayment?.trajet.price} Ar
              </Text>
              <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Détails de la carte
                </Text>
                <CardField
                  postalCodeEnabled={false}
                  placeholders={{ number: "1234 5678 9012 3456" }}
                  cardStyle={{
                    backgroundColor: "#FFFFFF",
                    textColor: "#1f2937",
                    borderColor: "#d1d5db",
                    borderWidth: 1,
                    borderRadius: 8,
                    placeholderColor: "#9ca3af",
                  }}
                  style={{ height: 50, marginBottom: 10 }}
                />
              </View>
              <TouchableOpacity
                onPress={handleStripePayment}
                disabled={paymentLoading}
                className={`flex-row justify-center items-center bg-blue-600 py-3 rounded-xl shadow-md ${paymentLoading ? 'opacity-50' : ''}`}
              >
                {paymentLoading ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="text-white font-bold text-base ml-2">
                      Traitement...
                    </Text>
                  </>
                ) : (
                  <Text className="text-white font-bold text-base">
                    Payer par carte
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowStripeModal(false)}
                className="mt-4 bg-gray-200 py-3 rounded-xl shadow-md"
                disabled={paymentLoading}
              >
                <Text className="text-gray-800 text-center font-bold">Annuler</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </SafeAreaView>
      </ImageBackground>
    </StripeProvider>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <View className="flex-row items-center gap-3 mb-2">
    {icon}
    <Text className="text-gray-700 font-medium">{label}:</Text>
    <Text className="text-gray-600 flex-1">{value}</Text>
  </View>
);

export default MyTickets;