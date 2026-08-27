const STORAGE_PREFIX = 'kanban_';

/**
 * Load and parse a value from localStorage.
 * Returns `fallback` when the key is absent or parsing fails.
 */
export function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load "${key}" from localStorage:`, err);
    return fallback;
  }
}

/**
 * Serialize a value and persist it to localStorage.
 * Swallows quota errors gracefully — the app still works in-memory.
 */
export function saveToStorage(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(STORAGE_PREFIX + key, serialized);
  } catch (err) {
    console.error(`Failed to save "${key}" to localStorage:`, err);
  }
}

/**
 * Clear all kanban keys from localStorage.
 */
export function clearAllStorage() {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_PREFIX));
    keys.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
}

/**
 * Check if seed data has already been loaded.
 */
export function isSeeded() {
  return loadFromStorage('seeded', false);
}

export function markSeeded() {
  saveToStorage('seeded', true);
}
