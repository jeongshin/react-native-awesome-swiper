import type { ReactElement } from 'react';
import React from 'react';
import { ScrollView } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import Basic from './Basic.story';
import { storybookWebSettingsDecorator } from '../storybook.utils';

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
  .addDecorator(storybookWebSettingsDecorator)
  .add('Basic', () => <BasicStory />, {});
