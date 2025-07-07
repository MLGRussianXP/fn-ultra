import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { LoginForm } from './login-form';

describe('LoginForm', () => {
  it('renders and submits email and password', () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    fireEvent.changeText(
      screen.getByPlaceholderText(/email/i),
      'test@example.com'
    );
    fireEvent.changeText(
      screen.getByPlaceholderText(/password/i),
      'password123'
    );
    fireEvent.press(screen.getByText('login.signIn'));
    expect(onSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
