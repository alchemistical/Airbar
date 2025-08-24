// Intent management utility for persisting user intent across sessions

export type UserIntent = "send" | "travel" | null;

const INTENT_KEY = "airbar_user_intent";

export function getStoredIntent(): UserIntent {
  try {
    const stored = localStorage.getItem(INTENT_KEY);
    if (stored === "send" || stored === "travel") {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredIntent(intent: UserIntent): void {
  try {
    if (intent) {
      localStorage.setItem(INTENT_KEY, intent);
    } else {
      localStorage.removeItem(INTENT_KEY);
    }
  } catch {
    // Fail silently if localStorage is not available
  }
}

export function clearStoredIntent(): void {
  try {
    localStorage.removeItem(INTENT_KEY);
  } catch {
    // Fail silently
  }
}