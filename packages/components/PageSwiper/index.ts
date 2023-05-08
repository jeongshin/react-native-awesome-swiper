import AnimatedHeaderImage from './components/AnimatedHeaderImage';
import AnimatedLineTabs from './components/AnimatedLineTabs';
import PageFlatList, {
  Page,
  PageProps,
  PageSwiperProps,
} from './components/PageFlatList';
import PageScrollView, {
  PageScrollViewProps,
} from './components/PageScrollView';
import { Provider } from './context';
import useAnimatedPageSwiperHeader from './hooks/useAnimatedPageSwiperHeader';

export type { Page, PageProps, PageSwiperProps, PageScrollViewProps };

export default {
  Provider,
  PageFlatList,
  PageScrollView,
  AnimatedHeaderImage,
  AnimatedLineTabs,
  useAnimatedPageSwiperHeader,
};
