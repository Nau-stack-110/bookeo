import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Payment = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { seats, totalAmount } = params;

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cin, setCin] = useState('');
  const [age, setAge] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Orange Money');

  const handlePayment = () => {
    if (!email || !name || !address || !cin || !age || !paymentMethod) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert('Success', 'Payment successful!', [
      { text: 'OK', onPress: () => router.push('/my-tickets') }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Payment Details</Text>
      <Text className="text-lg mb-2">Total Amount: {totalAmount} Ar</Text>
      <Text className="text-lg mb-4">Seats: {seats}</Text>

      <TextInput
        className="bg-white p-2 rounded mb-2"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        className="bg-white p-2 rounded mb-2"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="bg-white p-2 rounded mb-2"
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        className="bg-white p-2 rounded mb-2"
        placeholder="CIN"
        value={cin}
        onChangeText={setCin}
        keyboardType="numeric"
      />
      <TextInput
        className="bg-white p-2 rounded mb-2"
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Picker
        selectedValue={paymentMethod}
        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        className="bg-white p-2 rounded mb-2"
      >
        <Picker.Item label="Orange Money" value="Orange Money" />
        <Picker.Item label="Airtel Money" value="Airtel Money" />
        <Picker.Item label="Mvola" value="Mvola" />
      </Picker>

      <TouchableOpacity
        onPress={handlePayment}
        className="bg-green-500 p-4 rounded-lg mt-4"
      >
        <Text className="text-white text-center font-bold">Pay Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Payment; 