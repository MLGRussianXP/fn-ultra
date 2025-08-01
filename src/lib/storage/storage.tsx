import { MMKV } from 'react-native-mmkv';

// Create storage instance with optimized configuration
export const storage = new MMKV({
  id: 'app-storage',
  encryptionKey: 'fn-ultra-secure-key', // Basic encryption for sensitive data
});

// Memory cache for frequently accessed items to reduce disk I/O
const memoryCache: Record<string, { value: any; timestamp: number }> = {};

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(memoryCache).forEach((key) => {
    if (now - memoryCache[key].timestamp > CACHE_EXPIRATION) {
      delete memoryCache[key];
    }
  });
}, 60000); // Run cleanup every minute

/**
 * Get an item from storage with memory caching
 * @param key Storage key
 * @returns The stored value or null if not found
 */
export function getItem<T>(key: string): T | null {
  // Check memory cache first
  const cached = memoryCache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRATION) {
    return cached.value as T;
  }

  // If not in memory cache, get from persistent storage
  const value = storage.getString(key);
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as T;

    // Cache the result in memory for faster future access
    memoryCache[key] = { value: parsed, timestamp: Date.now() };

    return parsed;
  } catch (error) {
    console.error(`Error parsing stored value for key ${key}:`, error);
    return null;
  }
}

/**
 * Store an item in storage and memory cache
 * @param key Storage key
 * @param value Value to store
 */
export function setItem<T>(key: string, value: T) {
  try {
    // Update memory cache
    memoryCache[key] = { value, timestamp: Date.now() };

    // Update persistent storage
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing value for key ${key}:`, error);
  }
}

/**
 * Remove an item from storage and memory cache
 * @param key Storage key
 */
export function removeItem(key: string) {
  // Remove from memory cache
  delete memoryCache[key];

  // Remove from persistent storage
  storage.delete(key);
}

/**
 * Clear all items from storage and memory cache
 */
export function clearStorage() {
  // Clear memory cache
  Object.keys(memoryCache).forEach((key) => {
    delete memoryCache[key];
  });

  // Clear persistent storage
  storage.clearAll();
}

/**
 * Get all keys in storage
 * @returns Array of storage keys
 */
export function getAllKeys(): string[] {
  return storage.getAllKeys();
}
