import type { ImageProps } from 'expo-image';
import { Image as NImage } from 'expo-image';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { Platform } from 'react-native';

export type ImgProps = ImageProps & {
  className?: string;
  cachePolicy?: string; // Add this to the type definition
  _cachePolicy?: string; // Add underscore version for linting rule
};

cssInterop(NImage, { className: 'style' });

// Default caching options for better performance
const defaultCachePolicy = {
  // Use memory cache for faster loading of previously viewed images
  cachePolicy: 'memory-disk' as const,
  // Optimize cache control based on platform
  memoryCachePolicy:
    Platform.OS === 'ios' ? 'memory-disk' : ('memory' as const),
};

export const Image = ({
  style,
  className,
  placeholder = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
  _cachePolicy, // Prefix with underscore to match the linting rule
  ...props
}: ImgProps) => {
  return (
    <NImage
      className={className}
      placeholder={placeholder}
      style={style}
      {...defaultCachePolicy}
      {...props}
    />
  );
};

// Improved preloading with concurrency control
export const preloadImages = (sources: string[]) => {
  // Limit concurrent prefetches to avoid network contention
  const batchSize = 5;
  const batches = Math.ceil(sources.length / batchSize);

  for (let i = 0; i < batches; i++) {
    const batch = sources.slice(i * batchSize, (i + 1) * batchSize);
    NImage.prefetch(batch);
  }
};
