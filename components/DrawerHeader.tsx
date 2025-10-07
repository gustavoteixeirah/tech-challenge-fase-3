import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface DrawerHeaderProps {
  navigation?: any;
  state?: any;
}

const DrawerHeader: React.FC<DrawerHeaderProps> = ({ navigation, state }) => {
  const { user } = useAuth();
  const nav = useNavigation();
  const [activeRoute, setActiveRoute] = useState('Home');

  const displayName = user?.displayName?.trim() || user?.email?.split('@')[0] || 'Usuário';
  const userInitials = displayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      screen: 'Home',
    },
    {
      title: 'Extrato',
      icon: 'list-outline',
      screen: 'Transactions',
    },
    {
      title: 'Investimentos',
      icon: 'trending-up-outline',
      screen: 'Investments',
    },
  ];

  // Atualizar rota ativa quando o state mudar
  useEffect(() => {
    if (state?.routes && state?.index !== undefined) {
      const currentRoute = state.routes[state.index];
      if (currentRoute) {
        setActiveRoute(currentRoute.name);
      }
    }
  }, [state]);

  const handleNavigation = (screen: string) => {
    setActiveRoute(screen);
    nav.navigate(screen as never);
    // Fechar o drawer após navegar
    if (navigation) {
      navigation.closeDrawer();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitials}</Text>
        </View>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => {
          const isActive = activeRoute === item.screen;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                isActive && styles.activeMenuItem
              ]}
              onPress={() => handleNavigation(item.screen)}
            >
              <View style={styles.menuItemContent}>
                <Ionicons 
                  name={item.icon as any} 
                  size={24} 
                  color={isActive ? "#000000" : "#d8e373"} 
                />
                <Text style={[
                  styles.menuItemText,
                  isActive && styles.activeMenuItemText
                ]}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#000000',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d8e373',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#d8e373',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(216, 227, 115, 0.3)',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  menuContainer: {
    flex: 1,
    marginTop: 10,
  },
  menuItem: {
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(216, 227, 115, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(216, 227, 115, 0.1)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  activeMenuItem: {
    backgroundColor: '#d8e373',
    borderColor: '#d8e373',
  },
  activeMenuItemText: {
    color: '#000000',
    fontWeight: '600',
  },
});

export default DrawerHeader;
