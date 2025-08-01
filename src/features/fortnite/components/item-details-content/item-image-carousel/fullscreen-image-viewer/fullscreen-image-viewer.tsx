import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui';
import { Download } from '@/components/ui/icons';
import { translate } from '@/lib/i18n';

interface Props {
  images: string[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
}

// Helper function to validate URL
const isValidUrl = (url: string): boolean => {
  if (!url) return false;

  // Check if it's a remote URL or a local file URI
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  } else if (url.startsWith('file://')) {
    return true;
  }

  return false;
};

// Request permissions function
const requestPermissions = async (): Promise<boolean> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status !== 'granted') {
    console.error('Permission denied. Status:', status);
    Alert.alert(
      translate('errors.permission_denied'),
      translate('errors.media_library_permission_message')
    );
    return false;
  }
  return true;
};

// Download image function
const downloadImage = async (url: string): Promise<string> => {
  // Generate a unique filename
  const filename =
    FileSystem.documentDirectory +
    `fortnite_${Date.now()}.${url.split('.').pop() || 'png'}`;

  try {
    // Download the file
    const { uri } = await FileSystem.downloadAsync(url, filename);
    return uri;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

// Save to media library function
const saveToMediaLibrary = async (fileUri: string): Promise<void> => {
  try {
    const asset = await MediaLibrary.createAssetAsync(fileUri);

    if (!asset || !asset.id) {
      throw new Error('Failed to create asset: Asset ID is missing');
    }

    const albumName = 'Fortnite Items';
    await MediaLibrary.createAlbumAsync(albumName, asset, false);

    // Delete the temporary file
    await FileSystem.deleteAsync(fileUri, { idempotent: true });

    Alert.alert(translate('success'), translate('item_details.image_saved'));
  } catch (error) {
    console.error('Error saving to media library:', error);
    throw error;
  }
};

// Custom hook for image downloading
interface UseImageDownloadProps {
  images: string[];
  currentIndex: number;
}

interface UseImageDownloadResult {
  isDownloading: boolean;
  handleDownload: () => Promise<void>;
}

const useImageDownload = ({
  images,
  currentIndex,
}: UseImageDownloadProps): UseImageDownloadResult => {
  const [isDownloading, setIsDownloading] = useState(false);
  const isDownloadingRef = useRef(false);

  const handleDownload = useCallback(async () => {
    // Prevent multiple rapid save attempts
    if (isDownloadingRef.current) {
      return;
    }

    try {
      isDownloadingRef.current = true;
      setIsDownloading(true);

      // Get the current image URL
      const imageUrl = images[currentIndex];
      if (!imageUrl) {
        console.error('No image URL found at index', currentIndex);
        Alert.alert(
          translate('errors.error'),
          'No image URL found to download'
        );
        return;
      }

      // Validate URL
      if (!isValidUrl(imageUrl)) {
        console.error('Invalid image URL:', imageUrl);
        Alert.alert(translate('errors.error'), 'Invalid image URL format');
        return;
      }

      // Request permissions
      const permissionGranted = await requestPermissions();
      if (!permissionGranted) return;

      // Download the image to a local file
      const localUri = await downloadImage(imageUrl);

      // Save the local file to media library
      await saveToMediaLibrary(localUri);
    } catch (error) {
      console.error('Download error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

      Alert.alert(
        translate('errors.error'),
        translate('errors.image_save_failed')
      );
    } finally {
      isDownloadingRef.current = false;
      setIsDownloading(false);
    }
  }, [currentIndex, images]);

  return { isDownloading, handleDownload };
};

// Image item component
interface ImageItemProps {
  imageUrl: string;
  width: number;
}

const ImageItem = ({ imageUrl, width }: ImageItemProps) => (
  <View className="flex-1 items-center justify-center" style={{ width }}>
    <Image
      source={{ uri: imageUrl }}
      style={{ width: '100%', height: '80%' }}
      resizeMode="contain"
      accessibilityRole="image"
      testID="fullscreen-image"
      onLoad={() => {}}
      onError={() => {}}
    />
  </View>
);

// Controls components
interface ControlsProps {
  onClose: () => void;
  currentIndex: number;
  totalImages: number;
  isDownloading: boolean;
  onDownload: () => void;
}

const Controls = ({
  onClose,
  currentIndex,
  totalImages,
  isDownloading,
  onDownload,
}: ControlsProps) => (
  <>
    {/* Close button */}
    <TouchableOpacity
      onPress={onClose}
      className="absolute right-4 top-12 z-10 rounded-full bg-black/50 p-2"
      testID="fullscreen-close-button"
    >
      <Text className="text-lg text-white">✕</Text>
    </TouchableOpacity>

    {/* Image counter */}
    {totalImages > 1 && (
      <View className="absolute left-4 top-12 z-10 rounded-full bg-black/50 px-3 py-1">
        <Text className="text-white">
          {currentIndex + 1} / {totalImages}
        </Text>
      </View>
    )}

    {/* Download button */}
    <View className="absolute inset-x-0 bottom-8 flex-row justify-center">
      <TouchableOpacity
        onPress={onDownload}
        disabled={isDownloading}
        className="flex-row items-center rounded-full bg-white px-4 py-2"
        testID="fullscreen-download-button"
      >
        <Download className="mr-2 text-neutral-700" />
        <Text className="text-neutral-700">
          {isDownloading ? 'Saving...' : 'Save Image'}
        </Text>
      </TouchableOpacity>
    </View>
  </>
);

// Main component
export function FullscreenImageViewer({
  images,
  initialIndex,
  visible,
  onClose,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const { width } = Dimensions.get('window');

  const { isDownloading, handleDownload } = useImageDownload({
    images,
    currentIndex,
  });

  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      setCurrentIndex(slideIndex);
    },
    [width]
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          initialScrollIndex={initialIndex}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          decelerationRate="fast"
          onScroll={handleScroll}
          keyExtractor={(item) => item}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item: imageUrl }) => (
            <ImageItem imageUrl={imageUrl} width={width} />
          )}
        />

        <Controls
          onClose={onClose}
          currentIndex={currentIndex}
          totalImages={images.length}
          isDownloading={isDownloading}
          onDownload={handleDownload}
        />
      </View>
    </Modal>
  );
}
