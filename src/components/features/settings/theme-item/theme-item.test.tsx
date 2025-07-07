import { render } from '@testing-library/react-native';
import React from 'react';

import { ThemeItem } from './theme-item';

describe('ThemeItem', () => {
  it('renders without crashing', () => {
    render(<ThemeItem />);
  });
});
