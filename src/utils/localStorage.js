const STORAGE_PREFIX = 'flowboard_';

function safeJsonParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeJsonStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return safeJsonParse(raw, fallback);
  } catch (err) {
    console.warn('Failed to load state for key:', key, err);
    return fallback;
  }
}

export function saveState(key, value) {
  try {
    const raw = safeJsonStringify(value);
    if (raw !== null) {
      localStorage.setItem(STORAGE_PREFIX + key, raw);
    }
  } catch (err) {
    console.warn('Failed to save state for key:', key, err);
  }
}

export function removeState(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (err) {
    console.warn('Failed to remove state for key:', key, err);
  }
}
