import { render, screen } from '@testing-library/react-native';
import React from 'react';

import type { DetailedBrItem, ShopItem } from '@/api/fortnite/types';

import { ItemAdditionalInfo } from '../item-additional-info';
// Import the mocked components to spy on them
import { ItemInfo } from '../item-info';
import { ItemSelector } from '../item-selector';
import { ItemVariants } from '../item-variants';
import { ItemDetails } from './item-details';

// Mock the child components
jest.mock('../item-info', () => ({
  ItemInfo: jest.fn(() => null),
}));

jest.mock('../item-additional-info', () => ({
  ItemAdditionalInfo: jest.fn(() => null),
}));

jest.mock('../item-variants', () => ({
  ItemVariants: jest.fn(() => null),
}));

jest.mock('../item-selector', () => ({
  ItemSelector: jest.fn(() => null),
}));

// Mock data outside the describe block
const mockBrItem: DetailedBrItem = {
  id: 'test-item',
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
  images: {
    smallIcon: 'test-small.png',
    icon: 'test-icon.png',
  },
  added: '2023-01-01',
  variants: [
    {
      channel: 'Style',
      type: 'style',
      options: [
        {
          tag: 'Default',
          name: 'Default',
          image: 'test-variant.png',
          unlockRequirements: '',
        },
      ],
    },
  ],
};

const mockEntry: ShopItem = {
  regularPrice: 1000,
  finalPrice: 1000,
  devName: 'Test Bundle',
  offerId: 'test-offer',
  inDate: '2023-01-01',
  outDate: '2023-01-02',
  giftable: true,
  refundable: true,
  sortPriority: 0,
  layoutId: 'test',
  layout: {
    id: 'test',
    name: 'Test',
    index: 0,
    rank: 0,
    showIneligibleOffers: 'always',
    useWidePreview: false,
    displayType: 'normal',
  },
  tileSize: 'normal',
  displayAssetPath: 'test',
  newDisplayAssetPath: 'test',
  newDisplayAsset: {
    id: 'test',
    materialInstances: [],
    renderImages: [],
  },
  brItems: [mockBrItem],
};

describe('ItemDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with all components', () => {
    const onSelectItem = jest.fn();

    render(
      <ItemDetails
        entry={mockEntry}
        brItemData={mockBrItem}
        selectedItemId="test-item"
        onSelectItem={onSelectItem}
      />
    );

    // Check that Debug Info is displayed
    expect(screen.getByText('Debug Info')).toBeTruthy();

    // Check that all mock components were called with the right props
    const infoCall = (ItemInfo as jest.Mock).mock.calls;
    expect(infoCall.length).toBe(1);
    expect(infoCall[0][0].brItemData).toBe(mockBrItem);

    const additionalInfoCall = (ItemAdditionalInfo as jest.Mock).mock.calls;
    expect(additionalInfoCall.length).toBe(1);
    expect(additionalInfoCall[0][0].brItemData).toBe(mockBrItem);

    const variantsCall = (ItemVariants as jest.Mock).mock.calls;
    expect(variantsCall.length).toBe(1);
    expect(variantsCall[0][0].variants).toBe(mockBrItem.variants);

    const selectorCall = (ItemSelector as jest.Mock).mock.calls;
    expect(selectorCall.length).toBe(1);
    expect(selectorCall[0][0].entry).toBe(mockEntry);
    expect(selectorCall[0][0].selectedItemId).toBe('test-item');
    expect(selectorCall[0][0].onSelectItem).toBe(onSelectItem);
  });
});
