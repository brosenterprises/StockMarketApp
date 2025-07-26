import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchMarketIndices, fetchMultipleStocks } from '@/store/slices/stocksSlice';
import { theme, spacing, typography } from '@/constants/theme';
import { StockCard } from '@/components/StockCard';
import { MarketIndexCard } from '@/components/MarketIndexCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  
  const { stocks, marketIndices, loading } = useAppSelector(state => state.stocks);
  
  // Popular stocks to display on home screen
  const popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'];
  const popularStocks = popularSymbols.map(symbol => stocks[symbol]).filter(Boolean);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchMarketIndices()),
        dispatch(fetchMultipleStocks(popularSymbols)),
      ]);
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const handleStockPress = (symbol: string) => {
    navigation.navigate('StockDetail', { symbol });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadData} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Markets</Text>
        <TouchableOpacity onPress={handleSearchPress} style={styles.searchButton}>
          <Ionicons name="search" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Market Indices */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Market Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {marketIndices.map((index) => (
            <MarketIndexCard key={index.symbol} index={index} />
          ))}
        </ScrollView>
      </View>

      {/* Popular Stocks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Stocks</Text>
          <TouchableOpacity onPress={handleSearchPress}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {loading && popularStocks.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <View style={styles.stocksList}>
            {popularStocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                onPress={() => handleStockPress(stock.symbol)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Market Status */}
      <View style={styles.section}>
        <View style={styles.marketStatus}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>Market Open</Text>
          <Text style={styles.statusTime}>9:30 AM - 4:00 PM EST</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: theme.colors.text,
  },
  searchButton: {
    padding: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: theme.colors.text,
  },
  seeAllText: {
    ...typography.body2,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  stocksList: {
    paddingHorizontal: spacing.md,
  },
  marketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: theme.colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.body2,
    color: theme.colors.text,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  statusTime: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
});
