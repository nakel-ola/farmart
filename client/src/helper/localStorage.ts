export function getStorage<T>(key: string, initialValue: T) {
  if (typeof window === "undefined") {
    return initialValue;
  }
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : initialValue;
}

export function setStorage<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function clearStorage(key: string) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  }
}
