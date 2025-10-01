export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const generateUUID = (): string =>
  (globalThis.crypto?.randomUUID?.() ??
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })) as string;

export const deepMerge = <T extends object, U extends object>(target: T, source: U): T & U => {
  const isObject = (obj: unknown): obj is object => !!obj && typeof obj === 'object';
  if (!isObject(target) || !isObject(source)) return source as T & U;

  Object.keys(source as object).forEach((key) => {
    const sVal = (source as any)[key];
    if (isObject(sVal)) {
      if (!(target as any)[key]) (target as any)[key] = {};
      deepMerge((target as any)[key], sVal);
    } else {
      (target as any)[key] = sVal;
    }
  });
  return target as T & U;
};

export const randomInRange = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isEmptyObject = (obj: Record<string, unknown>): boolean =>
  obj && Object.keys(obj).length === 0;

export const safeJSONParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
};

export const debounce = <F extends (...args: any[]) => void>(fn: F, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <F extends (...args: any[]) => void>(fn: F, delay: number) => {
  let lastCall = 0;
  return (...args: Parameters<F>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};
