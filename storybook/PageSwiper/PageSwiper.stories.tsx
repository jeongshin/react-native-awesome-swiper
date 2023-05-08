import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import Basic from './Basic.story';
import { storybookWebSettingsDecorator } from '../storybook.utils';

export default {
  title: 'PageSwiper',
};

const BasicStory = (): ReactElement => {
  return (
    <View style={{ flex: 1 }}>
      <Basic />
    </View>
  );
};

storiesOf('PageSwiper', module)
  .addDecorator(storybookWebSettingsDecorator)
  .add('Basic', () => <BasicStory />, {});
