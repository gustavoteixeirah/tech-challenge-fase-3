import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { View, ActivityIndicator } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Transactions from "./screens/TransactionScreen";
import Toast from "react-native-toast-message";
import NewTransactionScreen from "./screens/NewTransactionScreen";
import InvestmentsScreen from "./screens/InvestmentsScreen";
import SplashScreen from "./screens/SplashScreen";

const Drawer = createDrawerNavigator();

function Router() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Mostra a splash screen por pelo menos 2.5 segundos
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Se ainda está carregando ou mostrando splash, mostra a splash screen
  if (loading || showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: true,
          drawerStyle: {
            paddingTop: 20,
            backgroundColor: "#EBE8ED",
          },
          drawerLabelStyle: {
            fontSize: 16,
            color: "#000",
          },
          drawerActiveTintColor: "#ccc",
          drawerItemStyle: {
            borderBottomWidth: 1,
            borderColor: "#ccc",
            borderRadius: 0,
          },
          drawerInactiveTintColor: "#000",
          headerTitleAlign: "center",
        }}
      >
        {user ? (
          // App protegido
          <>
            <Drawer.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Dashboard", drawerLabel: "Dashboard" }}
            />
            <Drawer.Screen
              name="Transactions"
              component={Transactions}
              options={{ title: "Extrato", drawerLabel: "Extrato" }}
            />
            <Drawer.Screen
              name="New"
              component={NewTransactionScreen}
              options={{
                title: "Nova Transação",
                drawerLabel: "Nova Transação",
                drawerItemStyle: { display: "none" },
              }}
            />
            <Drawer.Screen
              name="Investments"
              component={InvestmentsScreen}
              options={{
                title: "Investimentos",
                drawerLabel: "Investimentos",
              }}
            />
          </>
        ) : (
          // fluxo público
          <>
            <Drawer.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: "Entrar",
                drawerLabel: "Entrar",
                headerShown: false,
              }}
            />
            <Drawer.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                title: "Criar conta",
                drawerLabel: "Criar conta",
                headerShown: false,
              }}
            />
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
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
}
