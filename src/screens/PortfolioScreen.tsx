import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, spacing, typography } from '@/constants/theme';

export function PortfolioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio</Text>
      <Text style={styles.subtitle}>Track your investments and performance</Text>
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
