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
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
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
import backgroundImage from "../../assets/bghome3.png";

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    tel : "",
    created_at: "",
    fullname: "",
    bio: "",
    adresse: "",
    image: "",
    verified: false,
  });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState("profile");
  const [formData, setFormData] = useState({
    fullname: "",
    bio: "",
    adresse: "",
    old_password: "",
    new_password: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          const response = await axios.get(
            "https://vital-lizard-adequately.ngrok-free.app/api/me/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data;
          setUserData({
            username: data.user.username || "",
            email: data.user.email || "",
            tel: data.user.tel,
            created_at: data.created_at
              ? new Date(data.created_at).toLocaleDateString("fr-FR")
              : "Date inconnue",
            fullname: data.fullname || "",
            bio: data.bio || "",
            adresse: data.adresse || "",
            image: data.image || "",
            verified: data.verified || false,
          });
          setFormData({
            ...formData,
            fullname: data.fullname || "",
            bio: data.bio || "",
            adresse: data.adresse || "",
          });
        } else {
          setUserData({
            username: "Non connecté",
            email: "Veuillez vous connecter",
            created_at: "N/A",
            fullname: "",
            bio: "",
            adresse: "",
            image: "",
            verified: false,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        setUserData({
          username: "Erreur",
          email: "Erreur lors du chargement",
          created_at: "N/A",
          fullname: "",
          bio: "",
          adresse: "",
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
      try {
        const token = await AsyncStorage.getItem("accessToken");
        await axios.put(
          "https://vital-lizard-adequately.ngrok-free.app/api/me/",
          {
            fullname: formData.fullname,
            bio: formData.bio,
            adresse: formData.adresse,
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
          adresse: formData.adresse,
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
          confirmNewPassword: "",
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
    <SafeAreaView style={styles.safeArea}>
      <Image
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <Animated.View
            entering={FadeInUp.duration(500)}
            style={styles.headerContainer}
          >
            <Text style={styles.headerTitle}>Mon Profil</Text>
            <Text style={styles.headerSubtitle}>
              Gérez vos informations personnelles
            </Text>
          </Animated.View>

          {/* Profile Card */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(200)}
            style={styles.profileCard}
          >
            <View style={styles.profileInfo}>
              <Image
                source={userData.image ? { uri: userData.image } : profileImage}
                style={styles.profileImage}
              />
              <View style={styles.profileDetails}>
                <View style={styles.profileNameContainer}>
                <Text style={styles.profileEmail}>
                  {loading ? "Chargement..." : userData.email}
                </Text>
                  {userData.verified && (
                    <Feather
                      name="check-circle"
                      size={20}
                      color="#388E3C"
                      style={styles.verifiedIcon}
                    />
                  )}
                </View>
                {/* <Text style={styles.profileName}>
                    {loading ? "Chargement..." : userData.username}
                  </Text> */}
                <Text style={styles.profileTel}>
                  {loading ? "Chargement..." : userData.tel}
                </Text>
                <Text style={styles.profileJoined}>
                  Inscrit le {loading ? "..." : 
                    userData.created_at ? 
                      (() => {
                        const [day, month, year] = userData.created_at.split("/");
                        const date = new Date(`20${year}-${month}-${day}`);
                        return date.toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                      })() 
                      : "Date inconnue"
                    }
                </Text>
                {/* {userData.fullname && (
                  <Text style={styles.profileFullname}>
                    {userData.fullname}
                  </Text>
                )}
                {userData.bio && (
                  <Text style={styles.profileBio}>{userData.bio}</Text>
                )}
                {userData.adresse && (
                  <Text style={styles.profileAdresse}>
                    Adresse: {userData.adresse}
                  </Text>
                )} */}
              </View>
            </View>
            <View style={styles.profileActions}>
             
              <TouchableOpacity
                style={styles.actionButtonEdit}
                activeOpacity={0.7}
                onPress={handleEditProfile}
              >
                <Text style={styles.actionButtonText}>Modifier Profil</Text>
              </TouchableOpacity>
             
              <TouchableOpacity
                style={styles.actionButtonPassword}
                activeOpacity={0.7}
                onPress={handleEditPassword}
              >
                <Text style={styles.actionButtonText}>
                  Changer Mot de Passe
                </Text>
              </TouchableOpacity>

            </View>
          </Animated.View>

          {/* Menu Options */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(400)}
            style={styles.menuContainer}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/my-tickets")}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="ticket-alt" size={24} color="#388E3C" />
              <Text style={styles.menuItemText}>Mes Réservations</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Feather name="log-out" size={24} color="#D32F2F" />
              <Text style={styles.menuItemText}>Déconnexion</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Edit Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContainer}
            >
              <View style={styles.modalBackdrop}>
                <Animated.View
                  entering={BounceIn.duration(300)}
                  style={styles.modalContent}
                >
                  <Text style={styles.modalTitle}>
                    {editMode === "profile"
                      ? "Modifier le Profil"
                      : "Changer le Mot de Passe"}
                  </Text>
                  <ScrollView contentContainerStyle={styles.modalScrollContent}>
                    {editMode === "profile" ? (
                      <View style={styles.formContainer}>
                        <View style={styles.formField}>
                          <Text style={styles.formLabel}>Nom complet</Text>
                          <TextInput
                            style={styles.formInput}
                            value={formData.fullname}
                            onChangeText={(text) =>
                              setFormData({ ...formData, fullname: text })
                            }
                            placeholder="Entrez votre nom complet"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                        <View style={styles.formField}>
                          <Text style={styles.formLabel}>Bio</Text>
                          <TextInput
                            style={[styles.formInput, styles.formInputMultiline]}
                            value={formData.bio}
                            onChangeText={(text) =>
                              setFormData({ ...formData, bio: text })
                            }
                            placeholder="Parlez de vous..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                          />
                        </View>
                        <View style={styles.formField}>
                          <Text style={styles.formLabel}>Adresse</Text>
                          <TextInput
                            style={styles.formInput}
                            value={formData.adresse}
                            onChangeText={(text) =>
                              setFormData({ ...formData, adresse: text })
                            }
                            placeholder="Entrez votre adresse"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                    ) : (
                      <View style={styles.formContainer}>
                        <View style={styles.formField}>
                          <Text style={styles.formLabel}>
                            Ancien mot de passe
                          </Text>
                          <TextInput
                            style={styles.formInput}
                            secureTextEntry
                            value={formData.old_password}
                            onChangeText={(text) =>
                              setFormData({ ...formData, old_password: text })
                            }
                            placeholder="Entrez l'ancien mot de passe"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                        <View style={styles.formField}>
                          <Text style={styles.formLabel}>
                            Nouveau mot de passe
                          </Text>
                          <TextInput
                            style={styles.formInput}
                            secureTextEntry
                            value={formData.new_password}
                            onChangeText={(text) =>
                              setFormData({ ...formData, new_password: text })
                            }
                            placeholder="Entrez le nouveau mot de passe"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                        <View style={styles.formField}>
                          <Text style={styles.formLabel}>
                            Confirmer le nouveau mot de passe
                          </Text>
                          <TextInput
                            style={styles.formInput}
                            secureTextEntry
                            value={formData.confirmNewPassword}
                            onChangeText={(text) =>
                              setFormData({
                                ...formData,
                                confirmNewPassword: text,
                              })
                            }
                            placeholder="Confirmez le nouveau mot de passe"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                    )}
                  </ScrollView>
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.modalButtonCancel}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalButtonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButtonSave}
                      onPress={handleSaveChanges}
                    >
                      <Text style={styles.modalButtonText}>Enregistrer</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop:10,
    position : "relative"
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode:"cover"
  },
  contentContainer: {
    flex: 1,
    position: "relative",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 0
  },
  scrollWrapper: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: '#D32F2F',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 32,
    textAlign:'center',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign:'center',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  profileCard: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingRight: 10,
    paddingBottom:16,
    paddingTop:16,
    paddingLeft:10,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#388E3C', 
  },
  profileDetails: {
    marginLeft: 16,
    flex: 1,
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  profileEmail: {
    fontSize: 20,
    color: '#4B5563',
    marginTop: 4,
    color: '#D32F2F',
  },
  profileTel: {
    fontSize: 18,
    color: '#4B5563',
    marginTop: 4,
  },
  profileJoined: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  profileFullname: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  profileBio: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  profileAdresse: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  profileActions: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  actionButtonEdit: {
    flex: 1,
    backgroundColor: '#388E3C',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonPassword: {
    flex: 1,
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  menuContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  modalContainer: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 16,
  },
  modalScrollContent: {
    paddingBottom: 16,
  },
  formContainer: {
    gap: 16,
  },
  formField: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  formInput: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  formInputMultiline: {
    height: 96,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    gap: 12,
  },
  modalButtonCancel: {
    backgroundColor: 'gray',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  modalButtonSave: {
    backgroundColor: '#388E3C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});