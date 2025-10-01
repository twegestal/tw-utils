import { describe, it, expect } from 'vitest';
import { removeDuplicates, flattenArray, chunkArray } from '../src/arrayUtils';

describe('arrayUtils', () => {
  it('removeDuplicates removes repeated values', () => {
    expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    expect(removeDuplicates(['a', 'a', 'b'])).toEqual(['a', 'b']);
  });

  it('flattenArray flattens one level', () => {
    expect(flattenArray([[1], [2, 3], [4]])).toEqual([1, 2, 3, 4]);
    expect(flattenArray<string>([['a'], ['b', 'c']])).toEqual(['a', 'b', 'c']);
  });

  it('chunkArray splits into requested sizes, last chunk smaller if needed', () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunkArray([], 3)).toEqual([]);
    expect(chunkArray([1, 2], 5)).toEqual([[1, 2]]);
  });
});
