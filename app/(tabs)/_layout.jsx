// import { Tabs } from 'expo-router';
// import Ionicons from '@expo/vector-icons/Ionicons';

// export default function TabsLayout() {
//   return (
//     <Tabs
//     screenOptions={{
//         tabBarActiveTintColor: '#ffd33d',
//         headerStyle: {
//         backgroundColor: '#25292e',
//         },
//         headerShadowVisible: false,
//         headerTintColor: '#fff',
//         tabBarStyle: {
//         backgroundColor: '#25292e',
//         },
//     }}
//     >
//       <Tabs.Screen
//         name="home"
//         options={{
//           title: 'Home',
//           headerShown:false,
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="create"
//         options={{
//           title: 'Create',
//           headerShown:false,
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons name={focused ? 'create' : 'create-outline'} color={color} size={24} />
//           ),
//         }}
//       /><Tabs.Screen
//       name="bookmark"
//       options={{
//         title: 'Bookmark',
//         headerShown:false,
//         tabBarIcon: ({ color, focused }) => (
//           <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} color={color} size={24} />
//         ),
//       }}
//     />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           headerShown:false,
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24}/>
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        tabBarInactiveTintColor: '#999',
        headerStyle: {
          backgroundColor: '#25292e',
          borderBottomWidth: 0,
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#25292e',
          borderTopWidth: 0,
          paddingBottom: 5,
          height: 60,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'create' : 'create-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: 'Bookmark',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
