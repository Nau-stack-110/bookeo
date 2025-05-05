import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput, ImageBackground } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import bgImage from "../../assets/bghome3.png";

const CooperativeCard = ({ item, index }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500, delay: index * 100 });
    translateY.value = withTiming(0, { duration: 500, delay: index * 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Animated.View style={animatedStyle} className="bg-white rounded-2xl mx-4 mb-4 shadow-lg border border-gray-100">
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="p-5"
      >
        <Text className="text-xl font-semibold text-red-600 text-center mb-3">{item.nom}</Text>
        <View className="mb-3">
          <Text className="text-base font-medium text-green-600">
            <Ionicons name="location-sharp" size={16} color="#16a34a" /> Adresse:
          </Text>
          {item.adresse.map((adr, idx) => (
            <Text key={idx} className="text-sm text-gray-600 ml-1">• {adr}</Text>
          ))}
        </View>
        <Text className="text-sm text-gray-600 mb-3">
          <Ionicons name="bus-sharp" size={16} color="#16a34a" /> {item.nombre_taxibe} Taxi-brousse
        </Text>
        <Text className="text-sm text-gray-600 mb-4 leading-5">{item.bio}</Text>
        <Text className="text-xs text-gray-500 text-center mb-4">
          Membre depuis: {formatDate(item.created_at)}
        </Text>
        <TouchableOpacity className="bg-green-600 py-3 px-5 rounded-lg items-center">
          <Link href={`tel:${item.contact}`} className="text-base font-semibold text-white">
            Contacter: {item.contact}
          </Link>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CooperativeList = () => {
  const [nameFilter, setNameFilter] = useState('');
  const [cooperatives, setCooperatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCooperatives = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        setError("Token non trouvé. Veuillez vous reconnecter.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const response = await fetch('https://vital-lizard-adequately.ngrok-free.app/api/cooperative/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Échec du chargement des coopératives');
      }

      const data = await response.json();
      setCooperatives(data);
      setError(null);
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des coopératives.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCooperatives();
  }, []);

  const filteredCooperatives = cooperatives.filter((coop) =>
    coop.nom.toLowerCase().includes(nameFilter.toLowerCase())
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#dc2626" />
        <Text className="mt-3 text-base text-gray-600">Chargement des coopératives...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-base text-red-600 text-center mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-green-600 py-3 px-6 rounded-lg"
          onPress={fetchCooperatives}
        >
          <Text className="text-base font-semibold text-white">Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground
    source = {bgImage}
    style = {{flex: 1}}
    resizeMode="cover"> 
    <SafeAreaView className="flex-1">
      <View className="px-4 py-3">
        <Text className="text-2xl font-bold text-[#25292e] italic text-center">Nos Coopératives Membres</Text>
      </View>
      <TextInput
        className="mx-4 my-4 p-3 bg-white rounded-xl text-base text-gray-800 border border-gray-200 shadow-sm"
        placeholder="Rechercher une coopérative..."
        placeholderTextColor="#9ca3af"
        value={nameFilter}
        onChangeText={setNameFilter}
      />
      <FlatList
        data={filteredCooperatives}
        renderItem={({ item, index }) => (
          <CooperativeCard item={item} index={index} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
    </ImageBackground>
  );
};

export default CooperativeList;
