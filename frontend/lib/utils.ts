import { Paginated } from "@/types";

/**
 * Normalises DRF responses that may come as either a plain array
 * (when pagination_class = None) or a Paginated<T> envelope.
 */
export function toArrayResponse<T>(payload: T[] | Paginated<T>) {
  return Array.isArray(payload) ? payload : payload.results;
}
