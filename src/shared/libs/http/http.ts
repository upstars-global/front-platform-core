export function http<T>(data: T): Promise<T> {
  return Promise.resolve(data);
}
