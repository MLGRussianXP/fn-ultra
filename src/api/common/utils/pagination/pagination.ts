/**
 * Utilities for handling API pagination
 * @module api/common/utils/pagination
 */

import type {
  GetNextPageParamFunction,
  GetPreviousPageParamFunction,
} from '@tanstack/react-query';

import { getUrlParameters } from '../url-parameters';

/**
 * Generic type for paginated API responses
 */
export type PaginateQuery<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

/**
 * Default limit for pagination
 */
export const DEFAULT_LIMIT = 10;

/**
 * Function to extract the previous page parameter from a paginated response
 */
export const getPreviousPageParam: GetNextPageParamFunction<
  unknown,
  PaginateQuery<unknown>
> = (page) => getUrlParameters(page.previous)?.offset ?? null;

/**
 * Function to extract the next page parameter from a paginated response
 */
export const getNextPageParam: GetPreviousPageParamFunction<
  unknown,
  PaginateQuery<unknown>
> = (page) => getUrlParameters(page.next)?.offset ?? null;
