import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from "@expo/vector-icons";
import { View, Text, Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#8e8e93',
        headerStyle: {
          backgroundColor: '#1c1c1e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          height: 75,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
       name="selectSeats"
       options={{
        title: 'Seats',
        headerShown: false,
        tabBarButton: () => null,
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'grid' : 'grid-outline'} color={color} size={22} />
        ),
      }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="cooperative"
        options={{
          title: 'Coops',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'business' : 'business-outline'} color={color} size={21} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-tickets"
        options={{
          title: 'Tickets',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="ticket-alt" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'A propos',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={21} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} color={color} size={23} />
          ),
        }}
      />
      {/* Hidden Tabs */}
      <Tabs.Screen
        name="availableTaxibe"
        options={{
          title: 'Available',
          headerShown: false,
          tabBarButton: () => null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bus' : 'bus-outline'} color={color} size={22} />
          ),
        }}
      />

    </Tabs>
  );
}