import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Feather,
  MaterialIcons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const backgroundImage = require("../../assets/bghome3.png");

const AvailableTaxibe = () => {
  const router = useRouter();
  const { from, to, date } = useLocalSearchParams();

  const [taxibes, setTaxibes] = useState([]);
  const [selectedCooperative, setSelectedCooperative] = useState("Toutes");
  const [loading, setLoading] = useState(true);
  const [cooperatives, setCooperatives] = useState([
    { id: "Toutes", nom: "Toutes les coopératives" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Validate date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          console.error("Invalid date provided:", date);
          alert("Date invalide. Veuillez sélectionner une date valide.");
          router.push("/home");
          return;
        }

        setLoading(true);

        const available = await axios.get(
          "https://vital-lizard-adequately.ngrok-free.app/api/available_taxibe/",
          { params: { from, to, date: parsedDate.toISOString().split('T')[0] } }
        );

        const taxibeget = await axios.get(
          "https://vital-lizard-adequately.ngrok-free.app/api/taxibeget/"
        );

        const coopMap = {};
        taxibeget.data.forEach((item) => {
          coopMap[item.id] = item.cooperative.nom;
        });

        const merged = available.data.map((item) => ({
          ...item,
          taxibe: {
            ...item.taxibe,
            cooperative_nom: coopMap[item.taxibe.id] || "N/A",
          },
        }));

        setTaxibes(merged);

        const uniqueCooperatives = Array.from(
          new Map(
            taxibeget.data.map((item) => [
              item.cooperative.id,
              { id: item.cooperative.id, nom: item.cooperative.nom },
            ])
          ).values()
        );

        setCooperatives([
          { id: "Toutes", nom: "Toutes les coopératives" },
          ...uniqueCooperatives,
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Une erreur est survenue lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    if (from && to && date) {
      fetchData();
    } else {
      alert("Paramètres manquants. Veuillez retourner à l'accueil.");
      router.push("/home");
    }
  }, [from, to, date]);

  const filteredTaxibes =
    selectedCooperative === "Toutes"
      ? taxibes
      : taxibes.filter(
          (t) => t.taxibe.cooperative === Number(selectedCooperative)
        );

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      return "Date non disponible";
    }
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Heure non disponible";
    // Assuming timeString is in "HH:MM:SS" format, extract only hours and minutes
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "standard":
        return <FontAwesome5 name="bus" size={14} color="#4B5563" />;
      case "luxe":
        return <MaterialIcons name="stars" size={14} color="#4B5563" />;
      case "vip":
        return <FontAwesome5 name="crown" size={14} color="#4B5563" />;
      default:
        return <MaterialIcons name="category" size={14} color="#4B5563" />;
    }
  };

  const renderTaxibe = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        router.push({
          pathname: "/selectSeats",
          params: {
            totalPlaces: item.taxibe.nb_place,
            availablePlaces: item.place_dispo,
            marque: item.taxibe.marque,
            trajetId: item.id,
            price: item.price,
            categorie: item.taxibe.categorie,
            from,
            to,
            date: formattedDate,
          },
        });
      }}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: `https://vital-lizard-adequately.ngrok-free.app/${item.taxibe.photo}`,
        }}
        style={{ width: 80, height: 80, borderRadius: 12 }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#2563EB" }}>
          <FontAwesome5 name="shuttle-van" size={14} /> {item.taxibe.marque}
        </Text>
        <Text style={{ color: "#4B5563", fontSize: 13, marginTop: 4 }}>
          <MaterialIcons name="business" size={14} />{" "}
          {item.taxibe.cooperative_nom}
        </Text>
        <Text style={{ color: "#4B5563", fontSize: 13, marginTop: 4 }}>
          {getCategoryIcon(item.taxibe.categorie)} {item.taxibe.categorie}
        </Text>
        <Text style={{ color: "#4B5563", fontSize: 13, marginTop: 2 }}>
          <Feather name="user" size={14} /> Chauffeur : {item.taxibe.chauffeur}
        </Text>
        <Text style={{ color: "#10B981", fontSize: 13, marginTop: 2 }}>
          <Feather name="users" size={14} /> {item.place_dispo}/
          {item.taxibe.nb_place} places
        </Text>
        <Text style={{ color: "#EF4444", fontSize: 13, marginTop: 2 }}>
          <Feather name="dollar-sign" size={14} /> {item.price} Ar
        </Text>
        <Text style={{ color: "#4B5563", fontSize: 13, marginTop: 2 }}>
          <Feather name="clock" size={14} /> Départ : {formatTime(item.time)}
        </Text>
      </View>
      <Feather name="chevron-right" size={24} color="gray" />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Feather name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 12,
            fontStyle: "italic",
          }}
        >
          TAXI-BROUSSE DISPONIBLES
        </Text>
      </View>

      {from && to && date ? (
        <>
          <Text
            style={{
              marginTop: 20,
              fontSize: 16,
              color: "red",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {from} → {to}
          </Text>
          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            {formatDate(date)}
          </Text>
        </>
      ) : (
        <Text
          style={{
            marginTop: 20,
            fontSize: 16,
            color: "red",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          Paramètres manquants. Veuillez retourner à l'accueil.
        </Text>
      )}

      <View style={{ backgroundColor: "white", borderRadius: 12, marginTop: 16, marginBottom: 16 }}>
        <Picker
          selectedValue={selectedCooperative}
          onValueChange={(value) => setSelectedCooperative(value)}
        >
          {cooperatives.map((coop) => (
            <Picker.Item key={coop.id} label={coop.nom} value={coop.id} />
          ))}
        </Picker>
      </View>

      {loading && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      )}

      {!loading && filteredTaxibes.length === 0 && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Entypo name="circle-with-cross" size={48} color="#fff" />
          <Text style={{ marginTop: 8 }}>
            Aucun taxi disponible
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={filteredTaxibes}
          renderItem={renderTaxibe}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default AvailableTaxibe;