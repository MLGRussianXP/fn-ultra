/**
 * Utilities for normalizing paginated API responses
 * @module api/common/utils/normalize-pages
 */

import type { PaginateQuery } from '../pagination';

/**
 * Normalizes paginated results into a flat array
 * @param pages Array of paginated query results
 * @returns Flattened array of results
 */
export function normalizePages<T>(pages?: PaginateQuery<T>[]): T[] {
  return pages
    ? pages.reduce((prev: T[], current) => [...prev, ...current.results], [])
    : [];
}
