# useSwiperContext

## Overview

`useSwiperContext` is hooks to read internal context of scale swiper

## Type

```ts
interface SwiperContextType {
  itemCount: number; // data length
  itemWidth: number; // item width calculated from slide count
  scrollX: Animated.Value; // FlatList animated value of content offset x
  activeIndex: number; // current centered item index
}
```

## Example

```tsx
import { useSwiperContext } from 'react-native-awesome-swiper';

const MyItem = () => {
  const { itemCount, itemWidth, scrollX, activeIndex } = useSwiperContext();

  return <View />;
};
```
