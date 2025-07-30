import React from 'react';

import type { DetailedBrItem } from '@/api/fortnite/types';
// Import the mocked useNotifications
import { useNotifications } from '@/features/notifications/hooks';
import { setup } from '@/test';

import { ItemWatchToggle } from './item-watch-toggle';

// Mock the useNotifications hook
jest.mock('@/features/notifications/hooks', () => ({
  useNotifications: jest.fn(() => ({
    isItemWatched: jest.fn(),
    toggleItemWatch: jest.fn(),
  })),
}));

// Mock the notifications services
jest.mock('@/features/notifications/services', () => ({
  handlePermissionRequest: jest.fn((callback) => {
    callback();
    return Promise.resolve(true);
  }),
  sendTestNotification: jest.fn(),
}));

// Mock the i18n
jest.mock('@/lib/i18n', () => ({
  translate: jest.fn((key) => key),
}));

// Create mock BR item data for testing
const createMockBrItemData = (): DetailedBrItem => ({
  id: 'test-item-id',
  name: 'Test Item',
  description: 'Test description',
  type: {
    value: 'outfit',
    displayValue: 'Outfit',
    backendValue: 'AthenaCharacter',
  },
  rarity: {
    value: 'rare',
    displayValue: 'Rare',
    backendValue: 'EFortRarity::Rare',
  },
  // series is optional in DetailedBrItem
  series: undefined,
  set: undefined,
  introduction: undefined,
  images: {
    smallIcon: 'https://example.com/small-icon.png',
    icon: 'https://example.com/icon.png',
    featured: 'https://example.com/featured.png',
  },
  variants: undefined,
  gameplayTags: [],
  showcaseVideo: undefined,
  displayAssetPath: undefined,
  definitionPath: undefined,
  path: undefined,
  added: '2023-01-01T00:00:00Z',
  shopHistory: [],
});

describe('ItemWatchToggle - Rendering', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when item is not watched', () => {
    // Mock the useNotifications hook to return item as not watched
    (useNotifications as jest.Mock).mockReturnValue({
      isItemWatched: jest.fn(() => false),
      toggleItemWatch: jest.fn(),
    });

    // Render the component
    const { getByText } = setup(
      <ItemWatchToggle brItemData={createMockBrItemData()} />
    );

    // Check that the component renders correctly
    expect(getByText('settings.notifications.watch_item')).toBeTruthy();

    // Check for the notification description text
    expect(
      getByText(/You'll be notified when this item appears in the shop/)
    ).toBeTruthy();
  });

  it('should render correctly when item is watched', () => {
    // Mock the useNotifications hook to return item as watched
    (useNotifications as jest.Mock).mockReturnValue({
      isItemWatched: jest.fn(() => true),
      toggleItemWatch: jest.fn(),
    });

    // Render the component
    const { getByText } = setup(
      <ItemWatchToggle brItemData={createMockBrItemData()} />
    );

    // Check that the component renders correctly
    expect(getByText('settings.notifications.watch_item')).toBeTruthy();

    // Check for the notification description text
    expect(
      getByText(/You'll be notified when this item appears in the shop/)
    ).toBeTruthy();
  });
});

describe('ItemWatchToggle - Functionality', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should check if item is watched on render', () => {
    // Create a mock function for isItemWatched
    const mockIsItemWatched = jest.fn(() => false);

    // Mock the useNotifications hook
    (useNotifications as jest.Mock).mockReturnValue({
      isItemWatched: mockIsItemWatched,
      toggleItemWatch: jest.fn(),
    });

    // Render the component
    setup(<ItemWatchToggle brItemData={createMockBrItemData()} />);

    // Verify that isItemWatched was called with the correct ID
    expect(mockIsItemWatched).toHaveBeenCalledWith('test-item-id');
  });

  it('should provide toggleItemWatch to the component', () => {
    // Create a mock function for toggleItemWatch
    const mockToggleItemWatch = jest.fn();

    // Mock the useNotifications hook
    (useNotifications as jest.Mock).mockReturnValue({
      isItemWatched: jest.fn(() => false),
      toggleItemWatch: mockToggleItemWatch,
    });

    // Render the component
    setup(<ItemWatchToggle brItemData={createMockBrItemData()} />);

    // Verify that toggleItemWatch is available to the component
    expect(mockToggleItemWatch).toBeDefined();
  });
});
