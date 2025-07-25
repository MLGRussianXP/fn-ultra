import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Select } from '@/components/ui/select';

interface Param {
  key: string;
  label: string;
  type: string;
  primary: boolean;
  options?: string[];
}

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;
type HandleSearch = () => void;

function BooleanField<T extends Record<string, string>>({
  param,
  value,
  setValue,
}: {
  param: Param;
  value: T;
  setValue: SetValue<T>;
}) {
  return (
    <View key={param.key} className="mb-2">
      <Text className="mb-1 text-xs text-gray-500">{param.label}</Text>
      <View className="flex-row">
        <Pressable
          onPress={() =>
            setValue((v) => ({
              ...v,
              [param.key]: v[param.key] === 'true' ? '' : 'true',
            }))
          }
          className={`rounded-l px-2 py-1 ${value[param.key] === 'true' ? 'bg-blue-500' : 'bg-gray-200'}`}
        >
          <Text
            className={`text-xs ${value[param.key] === 'true' ? 'text-white' : 'text-black'}`}
          >
            Yes
          </Text>
        </Pressable>
        <Pressable
          onPress={() =>
            setValue((v) => ({
              ...v,
              [param.key]: v[param.key] === 'false' ? '' : 'false',
            }))
          }
          className={`rounded-r px-2 py-1 ${value[param.key] === 'false' ? 'bg-blue-500' : 'bg-gray-200'}`}
        >
          <Text
            className={`text-xs ${value[param.key] === 'false' ? 'text-white' : 'text-black'}`}
          >
            No
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
  param: Param;
  value: T;
  setValue: SetValue<T>;
}) {
  return (
    <View key={param.key} className="mb-2">
      <Text className="mb-1 text-xs text-gray-500">{param.label}</Text>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#d1d5db',
          paddingHorizontal: 8,
          paddingVertical: 4,
          marginTop: 2,
          marginBottom: 2,
          ...(typeof window !== 'undefined' &&
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? { backgroundColor: '#222', borderColor: '#444' }
            : {}),
        }}
      >
        <Select
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
    </View>
  );
}

function TextField<T extends Record<string, string>>({
  param,
  value,
  setValue,
  handleSearch,
}: {
  param: Param;
  value: T;
  setValue: SetValue<T>;
  handleSearch: HandleSearch;
}) {
  return (
    <View key={param.key} className="mb-2">
      <Text className="mb-1 text-xs text-gray-500">{param.label}</Text>
      <TextInput
        value={value[param.key] || ''}
        onChangeText={(t) => setValue((v) => ({ ...v, [param.key]: t }))}
        placeholder={param.label}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-black dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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
  param: Param;
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
  param: Param;
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
