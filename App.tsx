import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { View, ActivityIndicator } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import AppTabs from "./Navigation";

const Stack = createNativeStackNavigator();

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // fluxo autenticado → Tabs
        <Stack.Screen name="AppTabs" component={AppTabs} />
      ) : (
        // fluxo público
        <>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ title: "Entrar" }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: "Criar conta" }}
          />
        </>
      )}
    </Stack.Navigator>
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
