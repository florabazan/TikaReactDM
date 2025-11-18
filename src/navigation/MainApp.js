import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// PANTALLAS
import TurnosScreen from "../screens/TurnosScreen";
import Home from '../screens/Home';
import PacientesScreen from '../screens/PacientesScreen';
import FormPacienteScreen from "../screens/FormPacienteScreen";
import ComprobantesScreen from "../screens/ComprobantesScreen";
import CrearComprobanteScreen from "../screens/CrearComprobanteScreen";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* -------------------------
      STACK PACIENTES
-------------------------- */
function PacientesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PacientesHome" component={PacientesScreen} />
      <Stack.Screen name="FormPaciente" component={FormPacienteScreen} />
    </Stack.Navigator>
  );
}

/* -------------------------
      STACK COMPROBANTES
-------------------------- */
function ComprobantesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ComprobantesHome" component={ComprobantesScreen} />
      <Stack.Screen name="CrearComprobante" component={CrearComprobanteScreen} />
    </Stack.Navigator>
  );
}

/* -------------------------
      STACK DEL PERFIL
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
        tabBarStyle: { backgroundColor: '#f3e5f5' },
        tabBarActiveTintColor: '#8e24aa',
        tabBarInactiveTintColor: '#b39ddb',

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'TurnosTab') iconName = 'calendar';
          else if (route.name === 'PacientesTab') iconName = 'people';
          else if (route.name === 'ComprobantesTab') iconName = 'receipt';
          else if (route.name === 'PerfilTab') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="TurnosTab" component={TurnosScreen} options={{ title: 'Turnos' }} />
      <Tab.Screen name="PacientesTab" component={PacientesStack} options={{ title: 'Pacientes' }} />
      <Tab.Screen name="ComprobantesTab" component={ComprobantesStack} options={{ title: 'Comprobantes' }} />
      <Tab.Screen name="PerfilTab" component={PerfilStack} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
