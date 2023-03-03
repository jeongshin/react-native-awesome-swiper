import { act, render, RenderAPI, waitFor } from '@testing-library/react-native';
import { cloneData } from '../FlatList';

describe('[InfiniteSwiper] utils', () => {
  it('cloneData - returns 3 sets cloned array the input data', () => {
    const tests = [
      {
        data: [1, 2, 3],
        expected: [1, 2, 3, 1, 2, 3, 1, 2, 3],
      },
      {
        data: [1],
        expected: [1, 1, 1],
      },
      {
        data: [],
        expected: [],
      },
      {
        data: undefined,
        expected: [],
      },
    ];

    tests.forEach(({ data, expected }) => {
      expect(cloneData(data)).toEqual(expected);
    });
  });
});
