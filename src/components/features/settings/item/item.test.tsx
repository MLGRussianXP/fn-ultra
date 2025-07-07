import { render } from '@testing-library/react-native';
import React from 'react';

import { Item } from './item';

describe('Item', () => {
  it('renders without crashing', () => {
    render(<Item text="settings.terms" />);
  });
});
