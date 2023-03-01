class Logger {
  public log(...args: any) {
    if (!__DEV__) return;
    // eslint-disable-next-line no-console
    console.log('[react-native-awesome-swiper]', ...args);
  }

  public warn(...args: any) {
    if (!__DEV__) return;
    // eslint-disable-next-line no-console
    console.warn('[react-native-awesome-swiper]', ...args);
  }
}

export default new Logger();
