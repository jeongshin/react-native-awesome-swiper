import { getOffsetOfIndex } from '.';

describe('getOffsetOfIndex', () => {
  it('should return the correct offset for the given index', () => {
    const layout = new Map([
      [0, 100],
      [1, 50],
      [2, 75],
      [3, 90],
      [4, 60],
    ]);

    const gap = 10;

    const expected = [
      {
        index: 0,
        result: 0,
      },
      {
        index: 1,
        // 100 + 10
        result: 110,
      },
      {
        index: 2,
        // 100 + 10 + 50 + 10
        result: 170,
      },
      {
        index: 3,
        // 100 + 10 + 50 + 10 + 75 + 10
        result: 255,
      },
    ];

    expected.map(({ index, result }) =>
      expect(getOffsetOfIndex({ layout, index, gap })).toBe(result),
    );
  });
});
