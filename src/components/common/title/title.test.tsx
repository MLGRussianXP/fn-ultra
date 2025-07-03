import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { Title } from './title';

describe('Title', () => {
  it('renders with text', () => {
    render(<Title text="Hello" />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });
});
