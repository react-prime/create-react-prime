export * from './installer';
export * from './prompt';

export * from '../ioc/types';
export * from '../utils/types';

export type ValueOf<T> = T[keyof T];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArr = any[];

export type Json = string | number | boolean | { [key: string]: Json } | Json[] | null;

export type PromiseFn<T = void> = () => Promise<T>;
