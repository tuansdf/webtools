export type MockDataFn = (...args: unknown[]) => unknown;
export type MockDataRequest = Record<string, string>;
export type MockDataFns = Record<string, MockDataFn>;
export type MockDataResult = Record<string, unknown>;
