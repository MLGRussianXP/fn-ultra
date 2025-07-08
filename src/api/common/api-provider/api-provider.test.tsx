import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import { Text } from '@/components/ui';

import { APIProvider } from './api-provider';

describe('ApiProvider', () => {
  it('renders children', async () => {
    render(
      <APIProvider>
        <Text>Child</Text>
      </APIProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Child')).toBeTruthy();
    });
  });
});
