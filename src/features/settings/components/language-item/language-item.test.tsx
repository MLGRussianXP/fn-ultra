import { render } from '@testing-library/react-native';
import React from 'react';

import { LanguageItem } from './language-item';

describe('LanguageItem', () => {
  it('renders without crashing', () => {
    render(<LanguageItem />);
  });
});
