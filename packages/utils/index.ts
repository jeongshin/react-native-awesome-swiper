export function getItemLayoutFactory<T>(size: number) {
  return (_: T[] | null | undefined, index: number) => ({
    length: size,
    offset: size * index,
    index,
  });
}
