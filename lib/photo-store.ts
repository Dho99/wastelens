/**
 * In-memory photo store — survives client-side navigation, no size limit.
 * Lost on hard refresh (user retakes photo — acceptable).
 */

const store = new Map<string, File>();

export function setPhoto(key: string, file: File): void {
  store.set(key, file);
}

export function getPhoto(key: string): File | undefined {
  return store.get(key);
}

export function removePhoto(key: string): void {
  store.delete(key);
}
