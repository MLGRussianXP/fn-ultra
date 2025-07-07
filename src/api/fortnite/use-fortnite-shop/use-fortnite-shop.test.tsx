import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import * as React from 'react';

import { useFortniteShop } from './use-fortnite-shop';

// Mock the environment
jest.mock('@env', () => ({
  Env: {
    FORTNITE_API_URL: 'https://fortnite-api.com',
  },
}));

// Mock fetch
global.fetch = jest.fn();

const mockShopResponse = {
  status: 200,
  data: {
    hash: '65465bff1bdd2fcbbc9ea1db1bc098125e5c4624',
    date: '2025-07-02T00:00:00Z',
    vbuckIcon: 'https://fortnite-api.com/images/vbuck.png',
    entries: [
      {
        regularPrice: 1000,
        finalPrice: 1000,
        devName: '[VIRTUAL]1 x Mark 45 Bass',
        offerId: 'v2:/test-offer-id',
        inDate: '2025-07-02T00:00:00Z',
        outDate: '2025-07-06T23:59:59.999Z',
        giftable: true,
        refundable: true,
        sortPriority: -3,
        layoutId: 'IronMiles.98',
        layout: {
          id: 'IronMiles',
          name: 'Marvel',
          index: 22,
          rank: 194,
          showIneligibleOffers: 'always',
          useWidePreview: false,
          displayType: 'tileGrid',
        },
        tileSize: 'Size_1_x_1',
        displayAssetPath:
          '/Game/Catalog/DisplayAssets/DA_Featured_Sparks_Bass_BikeMold',
        newDisplayAssetPath:
          '/OfferCatalog/NewDisplayAssets/S31/DAv2_Sparks_Bass_BikeMold',
        newDisplayAsset: {
          id: 'DAv2_Sparks_Bass_BikeMold',
          materialInstances: [],
          renderImages: [
            {
              productTag: 'Product.Sparks',
              fileName: 'T_UI_Featured_Bass_BikeMold',
              image:
                'https://fortnite-api.com/images/cosmetics/br/newdisplayassets/feba3089b4e22eab/renderimage_0.png',
            },
          ],
        },
        brItems: [
          {
            id: 'Backpack_BikeMold_Bass',
            name: 'Mark 45 Bass',
            description:
              "Tony Stark's proprietary bass design from his own collection.",
            type: {
              value: 'backpack',
              displayValue: 'Back Bling',
              backendValue: 'AthenaBackpack',
            },
            rarity: {
              value: 'marvel',
              displayValue: 'MARVEL SERIES',
              backendValue: 'EFortRarity::Rare',
            },
            images: {
              smallIcon:
                'https://fortnite-api.com/images/cosmetics/br/backpack_bikemold_bass/smallicon.png',
              icon: 'https://fortnite-api.com/images/cosmetics/br/backpack_bikemold_bass/icon.png',
            },
            added: '2025-04-21T00:00:00Z',
          },
        ],
      },
    ],
  },
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useFortniteShop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches shop data successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockShopResponse,
    });

    const { result } = renderHook(() => useFortniteShop(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockShopResponse);
    expect(fetch).toHaveBeenCalledWith('https://fortnite-api.com/v2/shop');
  });

  it('handles fetch error', async () => {
    const errorMessage = 'Failed to fetch';
    (fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useFortniteShop(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(errorMessage);
  });

  it('handles non-ok response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useFortniteShop(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(
      'Failed to fetch Fortnite shop: 500'
    );
  });
});
