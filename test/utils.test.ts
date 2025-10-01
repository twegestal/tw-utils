import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  deepClone,
  generateUUID,
  deepMerge,
  randomInRange,
  capitalize,
  sleep,
  isEmptyObject,
  safeJSONParse,
  debounce,
  throttle,
} from '../src/utils';

describe('utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, 'setTimeout');
    vi.spyOn(globalThis, 'clearTimeout');
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('deepClone clones nested objects (by value, not reference)', () => {
    const obj = { a: 1, b: { c: 2 } };
    const clone = deepClone(obj);
    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj);
    expect(clone.b).not.toBe(obj.b);
  });

  it('generateUUID produces RFC4122 v4-like uuids', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('deepMerge merges recursively and mutates target (current behavior)', () => {
    const target = { foo: { a: 1 }, x: 1 } as any;
    const source = { foo: { b: 2 }, y: 2 } as any;
    const result = deepMerge(target, source);
    expect(result).toEqual({ foo: { a: 1, b: 2 }, x: 1, y: 2 });
    // assert mutation (documented behavior)
    expect(result).toBe(target);
  });

  it('randomInRange is within bounds (basic)', () => {
    for (let i = 0; i < 100; i++) {
      const n = randomInRange(5, 10);
      expect(n).toBeGreaterThanOrEqual(5);
      expect(n).toBeLessThanOrEqual(10);
    }
  });

  it('capitalize capitalizes first letter and lowercases rest', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('hELLO')).toBe('Hello');
    expect(capitalize('h')).toBe('H');
    expect(capitalize('')).toBe('');
  });

  it('sleep waits the given ms', async () => {
    const p = sleep(200);
    vi.advanceTimersByTime(200);
    await p; // resolves without timing out
  });

  it('isEmptyObject detects empty vs non-empty', () => {
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject({ a: 1 })).toBe(false);
  });

  it('safeJSONParse returns parsed value or fallback', () => {
    expect(safeJSONParse('{"a":1}', { a: 0 })).toEqual({ a: 1 });
    expect(safeJSONParse('not json', { ok: true })).toEqual({ ok: true });
  });

  it('debounce delays calls and only invokes once within window', async () => {
    const spy = vi.fn();
    const d = debounce(spy, 100);

    d('a');
    d('b');
    d('c'); // last call wins

    // nothing yet
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(99);
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('c');
  });

  it('throttle allows first call, then prevents until window elapses', () => {
    const spy = vi.fn();
    const t = throttle(spy, 100);

    t('a'); // immediate
    t('b'); // throttled
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('a');

    vi.advanceTimersByTime(100);
    t('c');
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('c');
  });
});
