export function getItemLayoutFactory<T>(size: number) {
  return (_: T, index: number) => ({
    length: size,
    offset: size * index,
    index,
  });
}
