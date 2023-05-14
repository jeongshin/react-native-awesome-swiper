import AnimatedHeaderImage from './components/AnimatedHeaderImage';
import AnimatedLineTabs from './components/AnimatedLineTabs';
import PageFlatList from './components/PageFlatList';
import PageScrollView from './components/PageScrollView';
import { Provider } from './context';
import useAnimatedPageSwiperHeader from './hooks/useAnimatedPageSwiperHeader';
import type {
  Page,
  PageProps,
  PageSwiperProps,
} from './components/PageFlatList';
import type {
  PageScrollViewProps,
} from './components/PageScrollView';

export type { Page, PageProps, PageSwiperProps, PageScrollViewProps };

export default {
  Provider,
  PageFlatList,
  PageScrollView,
  AnimatedHeaderImage,
  AnimatedLineTabs,
  useAnimatedPageSwiperHeader,
};
