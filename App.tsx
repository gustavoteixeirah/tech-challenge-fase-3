import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { View, ActivityIndicator } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Transactions from "./screens/TransactionScreen";
import Toast from "react-native-toast-message";
import NewTransactionScreen from "./screens/NewTransactionScreen";
import InvestmentsScreen from "./screens/InvestmentsScreen";
import SplashScreen from "./screens/SplashScreen";
import CustomHeader from "./components/CustomHeader";
import DrawerHeaderSimple from "./components/DrawerHeaderSimple";
import EditTransactionScreen from "./screens/EditTransactionScreen";
import { TransactionProvider } from "./context/TransactionContext";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Drawer Navigator (main menu)
function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          paddingTop: 20,
          backgroundColor: "#EBE8ED",
        },
        drawerLabelStyle: { fontSize: 16, color: "#000" },
        drawerActiveTintColor: "#ccc",
        drawerInactiveTintColor: "#000",
        drawerItemStyle: { borderBottomWidth: 1, borderColor: "#ccc" },
        headerTitleAlign: "center",
      }}
    >
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
          drawerItemStyle: { display: "none" }, // hide from drawer
        }}
      />
    </Drawer.Navigator>
  );
}

// Main Router handling auth & stack screens
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
          headerShown: false, // Desabilita o header padrão
          drawerStyle: {
            paddingTop: 20,
            backgroundColor: "#000000",
            width: 280,
          },
          drawerLabelStyle: {
            fontSize: 16,
            color: "#FFFFFF",
            fontWeight: "500",
          },
          drawerActiveTintColor: "#d8e373",
          drawerInactiveTintColor: "#CCCCCC",
          drawerItemStyle: {
            borderBottomWidth: 1,
            borderColor: "rgba(216, 227, 115, 0.2)",
            borderRadius: 0,
            marginHorizontal: 10,
            marginVertical: 2,
          },
          drawerActiveBackgroundColor: "rgba(216, 227, 115, 0.1)",
        }}
        drawerContent={(props) => (
          <View style={{ flex: 1 }}>
            <DrawerHeaderSimple navigation={props.navigation} />
          </View>
        )}
      >
        {user ? (
          // App protegido
          <>
            <Drawer.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "Dashboard",
                drawerItemStyle: { display: "none" },
              }}
            />
            <Drawer.Screen
              name="Transactions"
              component={Transactions}
              options={{
                title: "Extrato",
                drawerItemStyle: { display: "none" },
              }}
            />
            <Drawer.Screen
              name="New"
              component={NewTransactionScreen}
              options={{
                title: "Nova Transação",
                drawerItemStyle: { display: "none" },
              }}
            />
            <Drawer.Screen
              name="Edit"
              component={EditTransactionScreen}
              options={{
                title: "Editar Transação",
                drawerItemStyle: { display: "none" },
              }}
            />
            <Drawer.Screen
              name="Investments"
              component={InvestmentsScreen}
              options={{
                title: "Investimentos",
                drawerItemStyle: { display: "none" },
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
      <TransactionProvider>
        <NavigationContainer>
          <Router />
          <Toast />
        </NavigationContainer>
      </TransactionProvider>
    </AuthProvider>
  );
}
