import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  useWindowDimensions,
  Animated,
  ScrollViewProps,
  ViewStyle,
  Pressable,
  View,
} from 'react-native';
import { Page } from './PageFlatList';
import { usePageSwiperContext } from '../context';
import useDynamicItemLayout from '../hooks/useDynamicItemLayout';

interface AnimatedLineTabsProps<T> extends ScrollViewProps {
  pages: T[];
  renderTab?: (label: string, index: number) => React.ReactElement;
  activeIndex?: number;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  onPress?: (index: number) => void;
  viewOffset?: number;
  scrollPageConfig?: { animated?: boolean; scrollOnPress?: boolean };
  lineSize?: number;
  lineColor?: string;
  topInset?: number;
}

function AnimatedLineTabs<T extends Page>({
  pages,
  renderTab,
  contentContainerStyle,
  backgroundColor = 'white',
  lineSize = 4,
  lineColor = 'black',
  onPress,
  activeIndex,
  viewOffset = 24,
  scrollPageConfig,
  topInset,
  ...props
}: AnimatedLineTabsProps<T>) {
  const labels = pages.map((page) => page.label);

  const { width } = useWindowDimensions();

  const ref = useRef<ScrollView>(null);

  const container = useRef<View>(null);

  const [yFromWindow, setYFromWindow] = useState(0);

  const { scrollX, scrollY, flatListRef } = usePageSwiperContext();

  const { layout, handleLayout, doneReLayout } = useDynamicItemLayout(pages);

  const offsetLeft =
    Number(contentContainerStyle?.paddingLeft) ||
    Number(contentContainerStyle?.paddingHorizontal) ||
    Number(contentContainerStyle?.padding) ||
    0;

  useLayoutEffect(() => {
    if (!doneReLayout || typeof activeIndex !== 'number') return;

    const offset = getOffsetOfIndex({ layout, index: activeIndex, gap: 0 });

    ref.current?.scrollTo({ x: offset, y: 0 });
  }, [activeIndex, doneReLayout, viewOffset]);

  return (
    <View
      ref={container}
      onLayout={() => {
        container.current?.measureInWindow((left, top) => {
          if (typeof top !== 'number') return;
          setYFromWindow(top);
        });
      }}>
      {!!topInset && (
        <Animated.View
          style={{
            width: '100%',
            height: topInset,
            backgroundColor,
            opacity: scrollY.interpolate({
              inputRange: [0, yFromWindow, yFromWindow + topInset],
              outputRange: [0, 0, 1],
            }),
          }}
        />
      )}
      <ScrollView
        bounces={false}
        {...props}
        horizontal
        ref={ref}
        style={{ width, backgroundColor }}
        contentContainerStyle={contentContainerStyle}
        showsHorizontalScrollIndicator={false}>
        {labels.map((label, index) => {
          const key = `${label}-${index}`;

          return (
            <Pressable
              onPress={() => {
                onPress && onPress(index);
                if (scrollPageConfig?.animated === false) return;
                flatListRef.current?.scrollToIndex({
                  index,
                  animated: scrollPageConfig?.animated,
                });
              }}
              disabled={scrollPageConfig?.scrollOnPress === false}
              onLayout={(e) => handleLayout(e, index)}
              key={key}
              style={styles.container}>
              {renderTab ? renderTab(label, index) : <Text>{label}</Text>}
            </Pressable>
          );
        })}

        {doneReLayout && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                width: 1,
                height: lineSize,
                bottom: 0,
                backgroundColor: lineColor,
              },
              {
                transform: [
                  {
                    translateX: scrollX.interpolate({
                      inputRange: pages.map((_, index) => index * width),
                      outputRange: pages.map((_, index) => {
                        const width = layout.get(index);
                        if (!width) return 0;
                        return (
                          getOffsetOfIndex({ layout, index, gap: 0 }) +
                          width / 2 +
                          offsetLeft
                        );
                      }),
                    }),
                  },
                  {
                    scaleX: scrollX.interpolate({
                      inputRange: pages.map((_, index) => index * width),
                      outputRange: pages.map((_, index) => {
                        const width = layout.get(index);
                        if (!width) return 1;
                        return width;
                      }),
                    }),
                  },
                ],
              },
            ]}
          />
        )}
      </ScrollView>
    </View>
  );
}

export function getOffsetOfIndex({
  layout,
  index,
  gap,
}: {
  layout: Map<number, number>;
  index: number;
  gap: number;
}): number {
  // [[0, 108.33332824707031], [1, 61], [2, 46.00001525878906], [3, 76], [4, 86]]
  const itemLayout = [...layout.entries()].sort().map(([_, val]) => val);

  return itemLayout.reduce((acc, offset, currIndex) => {
    if (currIndex >= index) return acc;
    // acc + offset + gap
    return acc + offset + gap;
  }, 0);
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

export default AnimatedLineTabs;
