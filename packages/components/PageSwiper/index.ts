import AnimatedLineTabs from './components/AnimatedLineTabs';
import PageFlatList from './components/PageFlatList';
import { Provider } from './context';
import type {
  Page,
  PageProps,
  PageSwiperProps,
} from './components/PageFlatList';
import type { PageScrollViewProps } from './components/PageScrollView';

export type { Page, PageProps, PageSwiperProps, PageScrollViewProps };

// TODO
// import AnimatedHeaderImage from './components/AnimatedHeaderImage';
// import PageScrollView from './components/PageScrollView';
// import useAnimatedPageSwiperHeader from './hooks/useAnimatedPageSwiperHeader';

export default {
  Provider,
  PageFlatList,
  AnimatedLineTabs,

  // PageScrollView,
  // AnimatedHeaderImage,
  // useAnimatedPageSwiperHeader,
};
