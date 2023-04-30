import React from 'react';
import { storiesOf } from '@storybook/react-native';
import Horizontal from './Horizontal.story';
import LazyLoaded from './LazyLoaded.story';
import Vertical from './Vertical.story';

import { storybookWebSettingsDecorator } from '../storybook.utils';

export default {
  title: 'DynamicItemScrollSwiper',
};

storiesOf('DynamicItemScrollSwiper', module)
  .addDecorator(storybookWebSettingsDecorator)
  .add('Horizontal', () => <Horizontal />, {})
  .add('Vertical', () => <Vertical />, {})
  .add('LazyLoaded', () => <LazyLoaded />, {});
