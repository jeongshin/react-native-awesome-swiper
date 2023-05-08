import AnimatedHeaderImage from './components/AnimatedHeaderImage';
import AnimatedLineTabs from './components/AnimatedLineTabs';
import FlatList, {
  Page,
  PageProps,
  PageSwiperProps,
} from './components/FlatList';
import useAnimatedPageSwiperHeader from './hooks/useAnimatedPageSwiperHeader';

export type { Page, PageProps, PageSwiperProps };

export default {
  FlatList,
  AnimatedHeaderImage,
  AnimatedLineTabs,
  useAnimatedPageSwiperHeader,
};
