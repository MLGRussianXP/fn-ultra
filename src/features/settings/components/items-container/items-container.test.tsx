import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { Text } from '@/components/ui';

import { ItemsContainer } from './items-container';

describe('ItemsContainer', () => {
  it('renders children', () => {
    render(
      <ItemsContainer title="settings.terms">
        <Text>Child</Text>
      </ItemsContainer>
    );
    expect(screen.getByText('Child')).toBeTruthy();
  });
});
