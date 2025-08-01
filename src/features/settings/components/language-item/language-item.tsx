import * as React from 'react';

import type { OptionType } from '@/components/ui';
import { Options, useModal } from '@/components/ui';
import { translate, useSelectedLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n/resources';

import { Item } from '../item';

export const LanguageItem = () => {
  const { language, setLanguage } = useSelectedLanguage();
  const modal = useModal();
  const onSelect = React.useCallback(
    (option: OptionType) => {
      setLanguage(option.value as Language);
      modal.dismiss();
    },
    [setLanguage, modal]
  );

  const langs = React.useMemo(
    () => [
      { label: translate('settings.arabic'), value: 'ar' },
      { label: translate('settings.german'), value: 'de' },
      { label: translate('settings.english'), value: 'en' },
      { label: translate('settings.spanish'), value: 'es' },
      { label: translate('settings.spanish_latin'), value: 'es-419' },
      { label: translate('settings.french'), value: 'fr' },
      { label: translate('settings.indonesian'), value: 'id' },
      { label: translate('settings.italian'), value: 'it' },
      { label: translate('settings.japanese'), value: 'ja' },
      { label: translate('settings.korean'), value: 'ko' },
      { label: translate('settings.polish'), value: 'pl' },
      { label: translate('settings.portuguese_brazil'), value: 'pt-BR' },
      { label: translate('settings.russian'), value: 'ru' },
      { label: translate('settings.thai'), value: 'th' },
      { label: translate('settings.turkish'), value: 'tr' },
      { label: translate('settings.vietnamese'), value: 'vi' },
      { label: translate('settings.chinese_simplified'), value: 'zh-Hans' },
      { label: translate('settings.chinese_traditional'), value: 'zh-Hant' },
    ],

    []
  );

  const selectedLanguage = React.useMemo(
    () => langs.find((lang) => lang.value === language),
    [language, langs]
  );

  return (
    <>
      <Item
        text="settings.language"
        value={selectedLanguage?.label}
        onPress={modal.present}
      />
      <Options
        ref={modal.ref}
        options={langs}
        onSelect={onSelect}
        value={selectedLanguage?.value}
      />
    </>
  );
};
