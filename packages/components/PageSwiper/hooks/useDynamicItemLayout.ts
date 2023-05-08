import { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

function useDynamicItemLayout(pages: any[]) {
  const [mounted, setMounted] = useState(false);

  const [doneReLayout, setDoneReLayout] = useState(false);

  const layout = useRef(new Map<number, number>()).current;

  const handleLayout = (e: LayoutChangeEvent, index: number) => {
    const dimension = e.nativeEvent.layout.width;

    layout.set(index, dimension);

    const everyLayoutDone = pages.every((_, idx) => layout.has(idx));

    setDoneReLayout(everyLayoutDone);
  };

  return {
    layout,
    doneReLayout,
    handleLayout,
  };
}

export default useDynamicItemLayout;
