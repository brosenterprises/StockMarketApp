import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { TabParamList, RootStackParamList } from '@/types';
import { theme } from '@/constants/theme';

// Screens
import { HomeScreen } from '@/screens/HomeScreen';
import { PortfolioScreen } from '@/screens/PortfolioScreen';
import { WatchlistScreen } from '@/screens/WatchlistScreen';
import { NewsScreen } from '@/screens/NewsScreen';
import { MoreScreen } from '@/screens/MoreScreen';
import { StockDetailScreen } from '@/screens/StockDetailScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Markets':
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'Portfolio':
              iconName = focused ? 'pie-chart' : 'pie-chart-outline';
              break;
            case 'Watchlist':
              iconName = focused ? 'bookmark' : 'bookmark-outline';
              break;
            case 'News':
              iconName = focused ? 'newspaper' : 'newspaper-outline';
              break;
            case 'More':
              iconName = focused ? 'menu' : 'menu-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Markets" 
        component={HomeScreen}
        options={{ title: 'Markets' }}
      />
      <Tab.Screen 
        name="Portfolio" 
        component={PortfolioScreen}
        options={{ title: 'Portfolio' }}
      />
      <Tab.Screen 
        name="Watchlist" 
        component={WatchlistScreen}
        options={{ title: 'Watchlist' }}
      />
      <Tab.Screen 
        name="News" 
        component={NewsScreen}
        options={{ title: 'News' }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreScreen}
        options={{ title: 'More' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="StockDetail" 
        component={StockDetailScreen}
        options={({ route }) => ({ 
          title: route.params.symbol,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ 
          title: 'Search Stocks',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Settings',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'Profile',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
