import { useCallback, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

function useDynamicItemLayout<T>({
  data,
  horizontal,
}: {
  data: T[];
  horizontal: boolean | null;
}) {
  const initialScrollDone = useRef(false);

  const [mounted, setMounted] = useState(false);

  const [doneReLayout, setDoneReLayout] = useState(false);

  const layout = useRef(new Map<number, number>()).current;

  const handleLayout = (e: LayoutChangeEvent, index: number) => {
    const dimension = horizontal
      ? e.nativeEvent.layout.width
      : e.nativeEvent.layout.height;

    layout.set(index, dimension);

    const everyLayoutDone = data.every((_, idx) => layout.has(idx));

    setDoneReLayout(everyLayoutDone);

    setMounted((prev) => prev || everyLayoutDone);
  };

  const getOffsetOfIndex = useCallback(
    ({
      layout,
      index,
      gap,
    }: {
      layout: Map<number, number>;
      index: number;
      gap: number;
    }): number => {
      // [[0, 108.33332824707031], [1, 61], [2, 46.00001525878906], [3, 76], [4, 86]]
      const itemLayout = [...layout.entries()].sort().map(([_, val]) => val);

      return itemLayout.reduce((acc, offset, currIndex) => {
        if (currIndex >= index) return acc;
        // acc + offset + gap
        return acc + offset + gap;
      }, 0);
    },
    [],
  );

  return {
    layout,
    mounted,
    doneReLayout,
    handleLayout,
    getOffsetOfIndex,
    initialScrollDone,
  };
}

export default useDynamicItemLayout;
