import React from 'react';

import { cleanup, render, screen } from '@/test';

import { Select } from './select';

afterEach(cleanup);

describe('Select component', () => {
  it('should render label and trigger', () => {
    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
    ];
    render(<Select label="Select" options={options} testID="select" />);
    expect(screen.getByTestId('select-label')).toBeTruthy();
    expect(screen.getByTestId('select-trigger')).toBeTruthy();
  });
});
