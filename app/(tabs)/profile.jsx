import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  BounceIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import profileImage from "../../assets/robot.jpg";

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    created_at: "",
    fullname: "",
    bio: "",
    image: "",
    verified: false,
  });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState("profile");
  const [formData, setFormData] = useState({
    fullname: "",
    bio: "",
    old_password: "",
    new_password: "",
    confirmNewPassword:""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          console.log("Token trouvé:", token);
          const response = await axios.get(
            "https://vital-lizard-adequately.ngrok-free.app/api/me/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Réponse API:", response.data);
          const { username, email, profile } = response.data;
          setUserData({
            username: username || "Utilisateur",
            email: email || "email@example.com",
            created_at: profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("fr-FR")
              : "Date inconnue",
            fullname: profile?.fullname || "",
            bio: profile?.bio || "",
            image: profile?.image || "",
            verified: profile?.verified || false,
          });
          setFormData({
            ...formData,
            fullname: profile?.fullname || "",
            bio: profile?.bio || "",
          });
        } else {
          console.log("Aucun token trouvé");
          setUserData({
            username: "Non connecté",
            email: "Veuillez vous connecter",
            created_at: "N/A",
            fullname: "",
            bio: "",
            image: "",
            verified: false,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        if (error.response) {
          console.error("Détails erreur:", error.response.data);
        }
        setUserData({
          username: "Erreur",
          email: "Erreur lors du chargement",
          created_at: "N/A",
          fullname: "",
          bio: "",
          image: "",
          verified: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert("Confirmation", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");
            Alert.alert("Succès", "Vous avez été déconnecté avec succès.");
            router.replace("/sign-in");
          } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            Alert.alert(
              "Erreur",
              "Erreur lors de la déconnexion. Veuillez réessayer."
            );
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleEditProfile = () => {
    setEditMode("profile");
    setModalVisible(true);
  };

  const handleEditPassword = () => {
    setEditMode("password");
    setModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (editMode === "profile") {
      // Update profile logic here
      try {
        const token = await AsyncStorage.getItem("accessToken");
        await axios.put(
          "https://vital-lizard-adequately.ngrok-free.app/api/user-profile/",
          {
            fullname: formData.fullname,
            bio: formData.bio,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData({
          ...userData,
          fullname: formData.fullname,
          bio: formData.bio,
        });
        Alert.alert("Succès", "Profil mis à jour avec succès.");
        setModalVisible(false);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        Alert.alert("Erreur", "Erreur lors de la mise à jour du profil.");
      }
    } else {
      if (formData.new_password !== formData.confirmNewPassword) {
        Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas.");
        return;
      }
      try {
        const token = await AsyncStorage.getItem("accessToken");
        await axios.post(
          "https://vital-lizard-adequately.ngrok-free.app/api/change-password/",
          {
            old_password: formData.old_password,
            new_password: formData.new_password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Alert.alert("Succès", "Mot de passe changé avec succès.");
        setModalVisible(false);
        setFormData({
          ...formData,
          old_password: "",
          new_password: "",
          confirmNewPassword:"",
        });
      } catch (error) {
        console.error("Erreur lors du changement de mot de passe:", error);
        Alert.alert(
          "Erreur",
          "Erreur lors du changement de mot de passe. Vérifiez votre mot de passe actuel."
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header Section */}
        <Animated.View
          entering={FadeInUp.duration(500)}
          className="pt-12 pb-6 px-4 bg-green-700"
        >
          <Text className="text-3xl font-bold text-white">Profil</Text>
          <Text className="text-sm text-gray-200 mt-1">Gérez votre compte</Text>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          className="mx-4 bg-white rounded-xl p-4 mt-6 shadow-md"
        >
          <View className="flex-row items-center">
            <Image
              source={userData.image ? { uri: userData.image } : profileImage}
              className="w-20 h-20 rounded-full border-2 border-green-500"
            />
            <View className="ml-4 flex-1">
              <View className="flex-row items-center">
                <Text className="text-xl font-semibold text-gray-800">
                  {loading ? "Chargement..." : userData.username.username}
                </Text>
                {userData.verified && (
                  <Feather
                    name="check-circle"
                    size={18}
                    color="#10B981"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </View>
              <Text className="text-sm text-gray-600">
                {loading ? "Chargement..." : userData.username.email}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Inscrit le {loading ? "..." : userData.created_at}
              </Text>
              {userData.fullname && (
                <Text className="text-sm font-medium text-gray-700 mt-1">
                  {userData.fullname}
                </Text>
              )}
              {userData.bio && (
                <Text className="text-xs text-gray-500 mt-1">
                  {userData.bio}
                </Text>
              )}
            </View>
          </View>
          <View className="flex-row mt-4">
            <TouchableOpacity
              className="bg-green-500 py-2 px-4 rounded-lg self-start mr-2"
              activeOpacity={0.8}
              onPress={handleEditProfile}
            >
              <Text className="text-white font-medium">Modifier le Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-500 py-2 px-4 rounded-lg self-start"
              activeOpacity={0.8}
              onPress={handleEditPassword}
            >
              <Text className="text-white font-medium">
                Changer Mot de Passe
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Menu Options */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(600)}
          className="mx-4"
        >
          <TouchableOpacity
            className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm"
            onPress={() => router.push("/my-tickets")}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="ticket" size={24} color="#10B981" />
            <Text className="ml-4 text-gray-800 font-medium">
              Mes Réservations
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={24} color="#10B981" />
            <Text className="ml-4 text-gray-800 font-medium">Déconnexion</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Edit Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <Animated.View
              entering={BounceIn.duration(300)}
              className="bg-white rounded-xl p-6 w-11/12 max-h-[50%]"
            >
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                {editMode === "profile"
                  ? "Modifier le Profil"
                  : "Changer le Mot de Passe"}
              </Text>

              {editMode === "profile" ? (
                <View className="space-y-4">
                  <View>
                    <Text className="text-gray-700 font-medium mb-1">
                      Nom complet
                    </Text>
                    <TextInput
                      className="bg-gray-100 p-3 rounded-lg text-gray-800"
                      value={formData.fullname}
                      onChangeText={(text) =>
                        setFormData({ ...formData, fullname: text })
                      }
                      placeholder="Entrez votre nom complet"
                    />
                  </View>
                  <View>
                    <Text className="text-gray-700 font-medium mb-1">Bio</Text>
                    <TextInput
                      className="bg-gray-100 p-3 rounded-lg text-gray-800 h-24"
                      value={formData.bio}
                      onChangeText={(text) =>
                        setFormData({ ...formData, bio: text })
                      }
                      placeholder="Parlez de vous..."
                      multiline
                    />
                  </View>
                </View>
              ) : (
                <View className="space-y-4">
                  <View>
                    <Text className="text-gray-700 font-medium mb-1">
                      Ancien mot de passe
                    </Text>
                    <TextInput
                      className="bg-gray-100 p-3 rounded-lg text-gray-800"
                      secureTextEntry
                      value={formData.old_password}
                      onChangeText={(text) =>
                        setFormData({ ...formData, old_password: text })
                      }
                    />
                  </View>

                  <View>
                    <Text className="text-gray-700 font-medium mb-1">
                      Nouveau mot de passe
                    </Text>
                    <TextInput
                      className="bg-gray-100 p-3 rounded-lg text-gray-800"
                      secureTextEntry
                      value={formData.new_password}
                      onChangeText={(text) =>
                        setFormData({ ...formData, new_password: text })
                      }
                    />
                  </View>

                  <View>
                    <Text className="text-gray-700 font-medium mb-1">
                      Confirmer le nouveau mot de passe
                    </Text>
                    <TextInput
                      className="bg-gray-100 p-3 rounded-lg text-gray-800"
                      secureTextEntry
                      value={formData.confirmNewPassword}
                      onChangeText={(text) =>
                        setFormData({ ...formData, confirmNewPassword: text })
                      }
                    />
                  </View>
                </View>
              )}

              <View className="flex-row justify-end mt-6 space-x-3">
                <TouchableOpacity
                  className="bg-gray-300 py-2 px-4 rounded-lg"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-gray-800 font-medium">Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-green-500 py-2 px-4 ml-4 rounded-lg"
                  onPress={handleSaveChanges}
                >
                  <Text className="text-white font-medium">Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
