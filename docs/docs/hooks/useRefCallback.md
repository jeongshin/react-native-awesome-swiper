# useRefCallback

## Overview

`useRefCallback` is hooks to use `ref` of FlatList.

use generic for data type.

## Example

```tsx
import { useAnimatedFlatListRef } from 'react-native-awesome-swiper';

type MyDataType = string;

const MyItem = () => {
  const data: MyDataType[] = ['1', '2', '3'];

  const { ref, refCallback } = useRefCallback<FlatList<MyDataType>>();

  useEffect(() => {
    ref.current?.scrollToIndex({ index: 1, animated: true });
  }, []);

  return (
    <ScaleSwiper.Provider>
      <ScaleSwiper.FlatList<MyDataType>
        data={data}
        refCallback={refCallback}
        renderItem={({ item }) => (
          <Image style={styles.image} source={{ uri: item }} />
        )}
      />
    </ScaleSwiper.Provider>
  );
};
```
