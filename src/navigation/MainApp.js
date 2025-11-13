import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// PANTALLAS
import ListTurnosScreen from '../screens/ListTurnosScreen';
import FormTurnoScreen from '../screens/FormTurnoScreen';
import DetailTurnoScreen from '../screens/DetailTurnoScreen';
import Home from '../screens/Home';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* ----------------------------------------
   STACK DE TURNOS (LISTA → DETALLE → FORM)
----------------------------------------- */
function TurnosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListTurnos" component={ListTurnosScreen} />
      <Stack.Screen name="DetailTurno" component={DetailTurnoScreen} />
      <Stack.Screen name="FormTurno" component={FormTurnoScreen} />
    </Stack.Navigator>
  );
}

/* -------------------------
   STACK DEL PERFIL (HOME)
-------------------------- */
function PerfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PerfilHome" component={Home} />
    </Stack.Navigator>
  );
}

/* -------------------------
      TAB NAVIGATOR
-------------------------- */
export default function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#f3e5f5',
        },

        tabBarActiveTintColor: '#8e24aa',
        tabBarInactiveTintColor: '#b39ddb',

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'TurnosTab') {
            iconName = 'calendar';
          } else if (route.name === 'PerfilTab') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      {/* Pestaña de turnos */}
      <Tab.Screen 
        name="TurnosTab" 
        component={TurnosStack} 
        options={{ title: 'Turnos' }}
      />

      {/* Pestaña de perfil */}
      <Tab.Screen 
        name="PerfilTab" 
        component={PerfilStack} 
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}