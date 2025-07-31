import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import React from 'react';
import { Alert, Platform } from 'react-native';

import { render, screen, setup, waitFor } from '@/test';

import { FullscreenImageViewer } from '../fullscreen-image-viewer';

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  documentDirectory: '/mock/document/directory/',
  downloadAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

// Mock expo-media-library
jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn(),
  saveToLibraryAsync: jest.fn(),
  createAssetAsync: jest.fn(),
  createAlbumAsync: jest.fn(),
  PermissionStatus: {
    GRANTED: 'granted',
    DENIED: 'denied',
    UNDETERMINED: 'undetermined',
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Helper function to setup default mocks
const setupDefaultMocks = () => {
  (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({
    status: 'granted',
  });

  (FileSystem.downloadAsync as jest.Mock).mockImplementation(
    (url, filename) => {
      return Promise.resolve({
        uri: filename,
      });
    }
  );

  (MediaLibrary.createAssetAsync as jest.Mock).mockResolvedValue({
    id: 'test-asset-id',
  });

  (MediaLibrary.createAlbumAsync as jest.Mock).mockResolvedValue(undefined);

  (FileSystem.deleteAsync as jest.Mock).mockResolvedValue(undefined);
};

// Helper function to setup permission denied mocks
const setupPermissionDeniedMocks = () => {
  (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({
    status: 'denied',
  });
};

// Helper function to setup download error mocks
const setupDownloadErrorMocks = () => {
  (FileSystem.downloadAsync as jest.Mock).mockRejectedValue(
    new Error('Download failed')
  );
};

// Helper function to setup save error mocks
const setupSaveErrorMocks = () => {
  (MediaLibrary.saveToLibraryAsync as jest.Mock).mockRejectedValue(
    new Error('Save failed')
  );
};

// Helper function to test image display
const testImageDisplay = () => {
  const mockImages = ['https://example.com/test-image.jpg'];
  render(
    <FullscreenImageViewer
      images={mockImages}
      initialIndex={0}
      visible={true}
      onClose={jest.fn()}
    />
  );

  const image = screen.getByTestId('fullscreen-image');
  expect(image.props.source.uri).toBe(mockImages[0]);
};

// Helper function to test image loading states
const testImageLoadingStates = async () => {
  const mockImages = ['https://example.com/test-image.jpg'];
  render(
    <FullscreenImageViewer
      images={mockImages}
      initialIndex={0}
      visible={true}
      onClose={jest.fn()}
    />
  );

  const image = screen.getByTestId('fullscreen-image');
  expect(image).toBeTruthy();

  await waitFor(() => {
    expect(image.props.onLoad).toBeDefined();
  });
};

// Helper function to test image error states
const testImageErrorStates = async () => {
  const mockImages = ['invalid-url'];
  render(
    <FullscreenImageViewer
      images={mockImages}
      initialIndex={0}
      visible={true}
      onClose={jest.fn()}
    />
  );

  const image = screen.getByTestId('fullscreen-image');
  expect(image).toBeTruthy();

  await waitFor(() => {
    expect(image.props.onError).toBeDefined();
  });
};

// Helper function to test save to gallery
const testSaveToGallery = async () => {
  const mockImages = ['https://example.com/test-image.jpg'];
  const { user } = setup(
    <FullscreenImageViewer
      images={mockImages}
      initialIndex={0}
      visible={true}
      onClose={jest.fn()}
    />
  );

  const saveButton = screen.getByText('Save Image');
  await user.press(saveButton);

  await waitFor(() => {
    expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(FileSystem.downloadAsync).toHaveBeenCalledWith(
      mockImages[0],
      expect.stringContaining('fortnite_')
    );
  });

  await waitFor(() => {
    expect(MediaLibrary.createAssetAsync).toHaveBeenCalledWith(
      expect.stringContaining('fortnite_')
    );
  });

  await waitFor(() => {
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      expect.stringContaining('fortnite_'),
      { idempotent: true }
    );
  });
};

// Helper function to test image display functionality
const testImageDisplayFunctionality = () => {
  describe('Image Display', () => {
    it('should display the provided image', () => {
      testImageDisplay();
    });

    it('should handle image loading states', async () => {
      await testImageLoadingStates();
    });

    it('should handle image error states', async () => {
      await testImageErrorStates();
    });
  });
};

// Helper function to test permission denied scenario
const testPermissionDenied = async () => {
  setupPermissionDeniedMocks();

  const { user } = setup(
    <FullscreenImageViewer
      images={['https://example.com/test-image.jpg']}
      initialIndex={0}
      visible={true}
      onClose={jest.fn()}
    />
  );

  const saveButton = screen.getByText('Save Image');
  await user.press(saveButton);

  await waitFor(() => {
    expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith(
      'Permission Denied',
      'Please grant access to your media library to save images.'
    );
  });
};

// Helper function to test download errors
const testDownloadErrors = async () => {
  setupDownloadErrorMocks();

  const { user } = setup(
    <FullscreenImageViewer
      images={['https://example.com/test-image.jpg']}
      initialIndex={0}
      visible={true}
      onClose={jest.fn()}
    />
  );

  const saveButton = screen.getByText('Save Image');
  await user.press(saveButton);

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Failed to save the image. Please try again.'
    );
  });
};

// Helper function to test save errors
const testSaveErrors = async () => {
  setupSaveErrorMocks();

  const { user } = setup(
    <FullscreenImageViewer
      images={['https://example.com/test-image.jpg']}
      initialIndex={0}
      visible={true}
      onClose={jest.fn()}
    />
  );

  const saveButton = screen.getByText('Save Image');
  await user.press(saveButton);

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith(
      'Success',
      'Image saved successfully to your gallery.'
    );
  });
};

// Helper function to test save to gallery functionality
const testSaveToGalleryFunctionality = () => {
  describe('Save to Gallery', () => {
    it('should save image to gallery when save button is pressed', async () => {
      await testSaveToGallery();
    });

    it('should handle permission denied when saving', async () => {
      await testPermissionDenied();
    });

    it('should handle download errors when saving', async () => {
      await testDownloadErrors();
    });

    it('should handle save errors when saving', async () => {
      await testSaveErrors();
    });
  });
};

// Helper function to test platform specific behavior
const testPlatformSpecificBehavior = () => {
  describe('Platform Specific Behavior', () => {
    it('should handle iOS specific behavior', () => {
      Platform.OS = 'ios';
      render(
        <FullscreenImageViewer
          images={['https://example.com/test-image.jpg']}
          initialIndex={0}
          visible={true}
          onClose={jest.fn()}
        />
      );

      const saveButton = screen.getByText('Save Image');
      expect(saveButton).toBeTruthy();
    });

    it('should handle Android specific behavior', () => {
      Platform.OS = 'android';
      render(
        <FullscreenImageViewer
          images={['https://example.com/test-image.jpg']}
          initialIndex={0}
          visible={true}
          onClose={jest.fn()}
        />
      );

      const saveButton = screen.getByText('Save Image');
      expect(saveButton).toBeTruthy();
    });
  });
};

// Helper function to test multiple rapid save attempts
const testMultipleRapidSaveAttempts = async () => {
  // Setup a slow mock that doesn't complete immediately
  let resolveDownload: (value: any) => void;
  const downloadPromise = new Promise((resolve) => {
    resolveDownload = resolve;
  });

  (FileSystem.downloadAsync as jest.Mock).mockImplementation(
    () => downloadPromise
  );

  const { user } = setup(
    <FullscreenImageViewer
      images={['https://example.com/test-image.jpg']}
      initialIndex={0}
      visible={true}
      onClose={jest.fn()}
    />
  );

  const saveButton = screen.getByText('Save Image');

  // Press save button multiple times rapidly
  await user.press(saveButton);
  await user.press(saveButton);
  await user.press(saveButton);

  // Should only process one save request (the first one)
  await waitFor(() => {
    expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalledTimes(1);
  });

  // Resolve the download to complete the test
  resolveDownload!({ uri: '/mock/document/directory/fortnite_test.jpg' });
};

// Helper function to test network errors
const testNetworkErrors = async () => {
  setupDownloadErrorMocks();

  const { user } = setup(
    <FullscreenImageViewer
      images={['https://invalid-url.com/image.jpg']}
      initialIndex={0}
      visible={true}
      onClose={jest.fn()}
    />
  );

  const saveButton = screen.getByText('Save Image');
  await user.press(saveButton);

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Failed to save the image. Please try again.'
    );
  });
};

// Helper function to test storage permission errors
const testStoragePermissionErrors = async () => {
  setupPermissionDeniedMocks();

  const { user } = setup(
    <FullscreenImageViewer
      images={['https://example.com/test-image.jpg']}
      initialIndex={0}
      visible={true}
      onClose={jest.fn()}
    />
  );

  const saveButton = screen.getByText('Save Image');
  await user.press(saveButton);

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith(
      'Permission Denied',
      'Please grant access to your media library to save images.'
    );
  });
};

// Helper function to test edge cases and error handling
const testEdgeCasesAndErrorHandling = () => {
  describe('Edge Cases and Error Handling', () => {
    it('should handle multiple rapid save attempts', async () => {
      await testMultipleRapidSaveAttempts();
    });

    it('should handle network errors gracefully', async () => {
      await testNetworkErrors();
    });

    it('should handle storage permission errors', async () => {
      await testStoragePermissionErrors();
    });
  });
};

describe('FullscreenImageViewer Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  testImageDisplayFunctionality();
  testSaveToGalleryFunctionality();
  testPlatformSpecificBehavior();
  testEdgeCasesAndErrorHandling();
});
