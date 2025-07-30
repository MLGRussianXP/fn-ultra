import React from 'react';
import { Pressable, View } from 'react-native';

import { Input, Select, Text } from '@/components/ui';
import { translate } from '@/lib/i18n';

import { type SearchParam } from '../utils/search-params';

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;
type HandleSearch = () => void;

function BooleanField<T extends Record<string, string>>({
  param,
  value,
  setValue,
}: {
  param: SearchParam;
  value: T;
  setValue: SetValue<T>;
}) {
  return (
    <View key={param.key} className="mb-4">
      <Text className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {param.label}
      </Text>
      <View className="flex-row">
        <Pressable
          onPress={() =>
            setValue((v) => ({
              ...v,
              [param.key]: v[param.key] === 'true' ? '' : 'true',
            }))
          }
          className={`flex w-14 items-center justify-center rounded-l-lg py-2 ${value[param.key] === 'true' ? 'bg-[#8b5cf6]' : 'bg-neutral-200 dark:bg-neutral-700'}`}
        >
          <Text
            className={`w-full text-center text-sm ${value[param.key] === 'true' ? 'text-white' : 'text-neutral-800 dark:text-neutral-200'}`}
          >
            {translate('search.yes')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() =>
            setValue((v) => ({
              ...v,
              [param.key]: v[param.key] === 'false' ? '' : 'false',
            }))
          }
          className={`flex w-14 items-center justify-center rounded-r-lg py-2 ${value[param.key] === 'false' ? 'bg-[#8b5cf6]' : 'bg-neutral-200 dark:bg-neutral-700'}`}
        >
          <Text
            className={`w-full text-center text-sm ${value[param.key] === 'false' ? 'text-white' : 'text-neutral-800 dark:text-neutral-200'}`}
          >
            {translate('search.no')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function SelectField<T extends Record<string, string>>({
  param,
  value,
  setValue,
}: {
  param: SearchParam;
  value: T;
  setValue: SetValue<T>;
}) {
  return (
    <View key={param.key} className="mb-4">
      <Select
        label={param.label}
        value={value[param.key] || ''}
        onSelect={(v: string | number) =>
          setValue((prev) => ({ ...prev, [param.key]: v as string }))
        }
        options={
          param.options?.map((opt) => ({ label: opt, value: opt })) || []
        }
        placeholder="Select..."
      />
    </View>
  );
}

function TextField<T extends Record<string, string>>({
  param,
  value,
  setValue,
  handleSearch,
}: {
  param: SearchParam;
  value: T;
  setValue: SetValue<T>;
  handleSearch: HandleSearch;
}) {
  return (
    <View key={param.key} className="mb-4">
      <Input
        label={param.label}
        value={value[param.key] || ''}
        onChangeText={(t) => setValue((v) => ({ ...v, [param.key]: t }))}
        placeholder={`Enter ${param.label.toLowerCase()}...`}
        keyboardType="default"
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        maxLength={64}
      />
    </View>
  );
}

export function FieldPrimary<T extends Record<string, string>>({
  param,
  value,
  setValue,
  handleSearch,
}: {
  param: SearchParam;
  value: T;
  setValue: SetValue<T>;
  handleSearch: HandleSearch;
}) {
  if (param.type === 'boolean')
    return <BooleanField param={param} value={value} setValue={setValue} />;
  if (param.type === 'select' && param.options)
    return <SelectField param={param} value={value} setValue={setValue} />;
  return (
    <TextField
      param={param}
      value={value}
      setValue={setValue}
      handleSearch={handleSearch}
    />
  );
}

export function FieldAdditional<T extends Record<string, string>>({
  param,
  value,
  setValue,
  handleSearch,
}: {
  param: SearchParam;
  value: T;
  setValue: SetValue<T>;
  handleSearch: HandleSearch;
}) {
  if (param.type === 'boolean')
    return <BooleanField param={param} value={value} setValue={setValue} />;
  if (param.type === 'select' && param.options)
    return <SelectField param={param} value={value} setValue={setValue} />;
  return (
    <TextField
      param={param}
      value={value}
      setValue={setValue}
      handleSearch={handleSearch}
    />
  );
}
