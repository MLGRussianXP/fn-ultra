/**
 * Utility functions for memory management and cleanup
 * @module lib/utils/memory-cleanup
 */

import { Image } from 'expo-image';
import { Platform } from 'react-native';

import { queryClient } from '@/api/common/api-provider';

/**
 * Clear image cache to free up memory
 * @param clearDiskCache Whether to also clear the disk cache (defaults to false)
 */
export async function clearImageCache(clearDiskCache = false): Promise<void> {
  try {
    // Clear memory cache
    await Image.clearMemoryCache();

    // Optionally clear disk cache (use sparingly as it affects performance)
    if (clearDiskCache) {
      await Image.clearDiskCache();
    }
  } catch (error) {
    console.error('Failed to clear image cache:', error);
  }
}

/**
 * Clear query cache for specific endpoints to free up memory
 * @param queryKeys Array of query keys to clear
 */
export function clearQueryCache(queryKeys: string[]): void {
  queryKeys.forEach((key) => {
    queryClient.removeQueries({ queryKey: [key] });
  });
}

/**
 * Perform a comprehensive memory cleanup
 * This should be used sparingly, typically when the app is under memory pressure
 */
export async function performMemoryCleanup(): Promise<void> {
  try {
    // Clear image memory cache
    await Image.clearMemoryCache();

    // Clear inactive queries from cache
    queryClient.invalidateQueries({
      predicate: (query) => {
        // Only invalidate queries that haven't been used recently
        const lastUpdated = query.state.dataUpdatedAt;
        const hourAgo = Date.now() - 60 * 60 * 1000;
        return lastUpdated < hourAgo;
      },
    });

    // Run garbage collection if available (React Native doesn't expose this directly)
    if (Platform.OS === 'web' && global.gc) {
      global.gc();
    }
  } catch (error) {
    console.error('Failed to perform memory cleanup:', error);
  }
}

/**
 * Monitor memory usage and perform cleanup if needed
 * This is a placeholder as React Native doesn't provide direct memory monitoring
 * In a real implementation, you would use native modules to monitor memory
 */
export function setupMemoryMonitoring(): void {
  // This would be implemented with native modules for actual memory monitoring
  console.log('Memory monitoring setup (placeholder)');

  // For now, we'll just periodically clean up memory
  setInterval(
    async () => {
      await clearImageCache();
    },
    5 * 60 * 1000
  ); // Every 5 minutes
}
