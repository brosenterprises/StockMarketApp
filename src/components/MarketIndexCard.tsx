import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { MarketIndex } from '@/types';
import { theme, spacing, typography, shadows } from '@/constants/theme';

interface MarketIndexCardProps {
  index: MarketIndex;
}

export function MarketIndexCard({ index }: MarketIndexCardProps) {
  const isPositive = index.change >= 0;
  const changeColor = isPositive ? theme.colors.success : theme.colors.error;

  const formatValue = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>
        {index.name}
      </Text>
      
      <Text style={styles.value}>
        {formatValue(index.value)}
      </Text>
      
      <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
        <Ionicons
          name={isPositive ? 'trending-up' : 'trending-down'}
          size={14}
          color={changeColor}
        />
        <Text style={[styles.change, { color: changeColor }]}>
          {formatChange(index.change, index.changePercent)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginRight: spacing.sm,
    minWidth: 140,
    ...shadows.small,
  },
  name: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  change: {
    ...typography.caption,
    fontWeight: '600',
    marginLeft: 2,
  },
});
