import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { View, ActivityIndicator } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Transactions from "./screens/TransactionScreen";

const Drawer = createDrawerNavigator();

function Router() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Drawer.Navigator screenOptions={{ headerShown: true }}>
      {user ? (
        // App protegido
         <>
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Dashboard", drawerLabel: "Dashboard" }} />
        <Drawer.Screen name="Transactions" component={Transactions} options={{ title: "Extrato", drawerLabel: "Extrato" }} />
        </>
      ) : (
        // Fluxo público (login/cadastro)
        <>
          <Drawer.Screen name="SignIn" component={SignInScreen} options={{ title: "Entrar", drawerLabel: "Entrar" , headerShown: false }} />
          <Drawer.Screen name="SignUp" component={SignUpScreen} options={{ title: "Criar conta", drawerLabel: "Criar conta" , headerShown: false }} />
        </>
      )}
    </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </AuthProvider>
  );
}
