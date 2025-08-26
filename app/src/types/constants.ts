export type ValueIsKey<T extends Record<string, string>> = {
  [K in keyof T]: K;
};
