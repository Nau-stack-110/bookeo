import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#000',
        headerStyle: {
          backgroundColor: '#1c1c1e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          // backgroundColor: '#1c1c1e',
          backgroundColor: "#f1f1f1",
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 65,
          paddingBottom: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 12,
        },
      }}
    >
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
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="cooperative"
        options={{
          title: 'Cooperatives',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'business' : 'business-outline'} color={color} size={23} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={23} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-tickets"
        options={{
          title: 'Tickets',
          headerShown: false,
          tabBarButton: () => null,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name="ticket-alt" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          title: 'Payment',
          headerShown: false,
          tabBarButton: () => null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'card' : 'card-outline'} color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
