import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Stock } from '@/types';
import { theme, spacing, typography, shadows } from '@/constants/theme';

interface StockCardProps {
  stock: Stock;
  onPress: () => void;
  showWatchlistButton?: boolean;
  isInWatchlist?: boolean;
  onWatchlistToggle?: () => void;
}

export function StockCard({
  stock,
  onPress,
  showWatchlistButton = false,
  isInWatchlist = false,
  onWatchlistToggle,
}: StockCardProps) {
  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? theme.colors.success : theme.colors.error;

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {stock.name}
          </Text>
        </View>
        
        {showWatchlistButton && (
          <TouchableOpacity
            onPress={onWatchlistToggle}
            style={styles.watchlistButton}
          >
            <Ionicons
              name={isInWatchlist ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isInWatchlist ? theme.colors.primary : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{formatPrice(stock.price)}</Text>
        <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
          <Ionicons
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={16}
            color={changeColor}
          />
          <Text style={[styles.change, { color: changeColor }]}>
            {formatChange(stock.change, stock.changePercent)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.metricContainer}>
          <Text style={styles.metricLabel}>Volume</Text>
          <Text style={styles.metricValue}>{formatVolume(stock.volume)}</Text>
        </View>
        
        {stock.peRatio && (
          <View style={styles.metricContainer}>
            <Text style={styles.metricLabel}>P/E</Text>
            <Text style={styles.metricValue}>{stock.peRatio.toFixed(1)}</Text>
          </View>
        )}
        
        {stock.dividendYield && stock.dividendYield > 0 && (
          <View style={styles.metricContainer}>
            <Text style={styles.metricLabel}>Yield</Text>
            <Text style={styles.metricValue}>{stock.dividendYield.toFixed(2)}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    ...typography.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  name: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  watchlistButton: {
    padding: spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  price: {
    ...typography.h2,
    color: theme.colors.text,
    fontWeight: '600',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  change: {
    ...typography.body2,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricContainer: {
    alignItems: 'center',
  },
  metricLabel: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  metricValue: {
    ...typography.body2,
    color: theme.colors.text,
    fontWeight: '600',
  },
});
