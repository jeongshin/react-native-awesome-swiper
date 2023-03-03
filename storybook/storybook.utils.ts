import { Platform } from 'react-native';
import { StoryFn } from '@storybook/addons';

export function storybookWebSettingsDecorator<T extends React.ReactNode>(
  story: StoryFn<T>,
) {
  if (Platform.OS === 'web') {
    const root = document?.querySelector('#root');

    if (root) {
      (root as HTMLDivElement).style.overflowX = 'hidden';
    }
  }

  return story();
}
