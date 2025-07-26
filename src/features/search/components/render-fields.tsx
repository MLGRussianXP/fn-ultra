import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Select } from '@/components/ui/select';

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
    <View key={param.key} className="mb-2">
      <Text className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
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
          className={`rounded-l px-3 py-2 ${value[param.key] === 'true' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          <Text
            className={`text-sm ${value[param.key] === 'true' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}
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
          className={`rounded-r px-3 py-2 ${value[param.key] === 'false' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          <Text
            className={`text-sm ${value[param.key] === 'false' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}
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
  param: SearchParam;
  value: T;
  setValue: SetValue<T>;
}) {
  return (
    <View key={param.key} className="mb-2">
      <Text className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        {param.label}
      </Text>
      <View className="overflow-hidden rounded-lg">
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
  param: SearchParam;
  value: T;
  setValue: SetValue<T>;
  handleSearch: HandleSearch;
}) {
  return (
    <View key={param.key} className="mb-2">
      <Text className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        {param.label}
      </Text>
      <TextInput
        value={value[param.key] || ''}
        onChangeText={(t) => setValue((v) => ({ ...v, [param.key]: t }))}
        placeholder={param.label}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        keyboardType="default"
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        maxLength={64}
        placeholderTextColor="#9ca3af"
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
