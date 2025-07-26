import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { theme, spacing, typography } from '@/constants/theme';

type StockDetailRouteProp = RouteProp<RootStackParamList, 'StockDetail'>;

export function StockDetailScreen() {
  const route = useRoute<StockDetailRouteProp>();
  const { symbol } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{symbol}</Text>
      <Text style={styles.subtitle}>Detailed stock information and charts</Text>
      <Text style={styles.comingSoon}>Coming Soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: theme.colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  comingSoon: {
    ...typography.h3,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
