import React, { ReactElement } from 'react';
import { ScrollView } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import Basic from './Basic.story';
import { storybookWebSettingsDecorator } from '../storybook.utils';

export default {
  title: 'InfiniteSwiper',
};

const BasicStory = (): ReactElement => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <Basic />
    </ScrollView>
  );
};

storiesOf('InfiniteSwiper', module)
  .addDecorator(storybookWebSettingsDecorator)
  .add('Basic', () => <BasicStory />, {});
