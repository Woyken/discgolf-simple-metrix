export function throwFn(message?: string, options?: ErrorOptions): never {
  throw new Error(message, options);
}
