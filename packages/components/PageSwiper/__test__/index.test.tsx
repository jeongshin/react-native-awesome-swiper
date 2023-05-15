import React, { createRef } from 'react';
import type { FlatList } from 'react-native';
import { Dimensions, Text, View } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import PageSwiper from '..';
import type { Page } from '..';
import type { ReactTestInstance } from 'react-test-renderer';

const TEST_ID = 'FLAT_LIST';

describe('[PageSwiper] UI test', () => {
  it('[PageSwiper] PageFlatList should render pages with given label', async () => {
    const pages = [
      { label: 'pink', Component: SamplePage },
      { label: 'purple', Component: SamplePage },
      { label: 'green', Component: SamplePage },
      { label: 'yellow', Component: SamplePage },
      { label: 'gray', Component: SamplePage },
      { label: 'black', Component: SamplePage },
      { label: 'skyblue', Component: SamplePage },
    ];

    const renderAPI = render(
      <PageSwiper.Provider>
        <PageSwiper.PageFlatList
          pages={pages}
          initialNumToRender={pages.length}
        />
      </PageSwiper.Provider>,
    );

    expect(renderAPI.toJSON()).toBeTruthy();

    pages.map(({ label }) => {
      const text = renderAPI.getByTestId(label)?.children?.[0];
      expect(text).toEqual(label);
    });
  });

  it('[PageSwiper] PageFlatList should emit event on page index change by user scroll', async () => {
    const ref = createRef<FlatList<Page>>();

    const index = 2;

    const pages = [
      { label: 'pink', Component: SamplePage },
      { label: 'purple', Component: SamplePage },
      { label: 'green', Component: SamplePage },
      { label: 'yellow', Component: SamplePage },
      { label: 'gray', Component: SamplePage },
      { label: 'black', Component: SamplePage },
      { label: 'skyblue', Component: SamplePage },
    ];

    const onActivePageIndexChange = jest.fn();

    const renderAPI = render(
      <PageSwiper.Provider useNativeDriver={false}>
        <PageSwiper.PageFlatList
          testID={TEST_ID}
          ref={ref}
          pages={pages}
          initialNumToRender={pages.length}
          minimumViewTime={100}
          waitForInteraction={false}
          onActivePageIndexChange={onActivePageIndexChange}
        />
      </PageSwiper.Provider>,
    );

    scrollFlatListToIndex(renderAPI.getByTestId(TEST_ID), { index, pages });

    // minimumViewTime + frame update
    await new Promise((resolve) => setTimeout(resolve, 120));

    expect(onActivePageIndexChange).toHaveBeenCalled();
  });

  it('[PageSwiper] PageFlatList, AnimatedLineTabs integration test', async () => {
    const expected = 2;
    let result = 0;

    const onPress = jest.fn();

    const pages = [
      { label: 'pink', Component: SamplePage },
      { label: 'purple', Component: SamplePage },
      { label: 'green', Component: SamplePage },
      { label: 'yellow', Component: SamplePage },
      { label: 'gray', Component: SamplePage },
      { label: 'black', Component: SamplePage },
      { label: 'skyblue', Component: SamplePage },
    ];

    const renderAPI = render(
      <PageSwiper.Provider>
        <PageSwiper.AnimatedLineTabs
          pages={pages}
          onPress={(index) => {
            onPress();

            scrollFlatListToIndex(renderAPI.getByTestId(TEST_ID), {
              index,
              pages,
            });
          }}
        />
        <PageSwiper.PageFlatList
          testID={TEST_ID}
          pages={pages}
          initialNumToRender={pages.length}
          minimumViewTime={100}
          waitForInteraction={false}
          onActivePageIndexChange={(index) => {
            result = index;
          }}
        />
      </PageSwiper.Provider>,
    );

    const tab = renderAPI.getByTestId(`tab-${expected}`);

    expect(tab).toBeTruthy();

    fireEvent.press(tab);

    await waitFor(
      () => {
        expect(result).toEqual(expected);
      },
      { timeout: 1000 },
    );

    expect(onPress).toHaveBeenCalled();
  });
});

function SamplePage({ label }: { label: string }) {
  return (
    <View style={{ width: '100%', flex: 1 }}>
      <Text testID={`${label}`}>{label}</Text>
    </View>
  );
}

function scrollFlatListToIndex(
  el: ReactTestInstance,
  { index, pages }: { index: number; pages: any[] },
) {
  const width = Dimensions.get('screen').width;

  fireEvent.scroll(el, {
    nativeEvent: {
      contentOffset: {
        x: width * index,
      },
      contentSize: {
        width: width * pages.length,
      },
      layoutMeasurement: {
        width: width,
      },
    },
  });
}
