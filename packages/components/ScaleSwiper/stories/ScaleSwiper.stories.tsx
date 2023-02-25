import React, { ReactElement } from 'react';
import { Platform, ScrollView } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import Basic from './Basic.story';

export default {
  title: 'ScaleSwiper',
};

const BasicStory = (): ReactElement => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <Basic />
    </ScrollView>
  );
};

storiesOf('ScaleSwiper', module)
  .addDecorator((story) => {
    if (Platform.OS === 'web') {
      const root = document?.querySelector('#root');

      if (root) {
        (root as HTMLDivElement).style.overflowX = 'hidden';
      }
    }

    return story();
  })
  .add('Basic', () => <BasicStory />, {});
