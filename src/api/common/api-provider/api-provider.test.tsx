import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { Text } from '@/components/ui';

import { APIProvider } from './api-provider';

describe('ApiProvider', () => {
  it('renders children', () => {
    render(
      <APIProvider>
        <Text>Child</Text>
      </APIProvider>
    );
    expect(screen.getByText('Child')).toBeTruthy();
  });
});
