import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Input, View } from '@/components/ui';

type Props = {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
};

export function LoginForm({ onSubmit, isLoading = false }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = () => {
    onSubmit(email, password);
  };

  return (
    <View className="flex-1 justify-center px-4">
      <Input
        label={t('login.email')}
        placeholder={t('login.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <Input
        label={t('login.password')}
        placeholder={t('login.passwordPlaceholder')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />
      <Button
        label={t('login.signIn')}
        onPress={handleSubmit}
        loading={isLoading}
        className="mt-4"
      />
    </View>
  );
}
