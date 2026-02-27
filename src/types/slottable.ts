export type Slottable<T extends string> = {
  [K in T]?: React.ReactNode;
};
