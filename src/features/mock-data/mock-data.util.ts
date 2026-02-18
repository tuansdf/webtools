import { faker } from "@faker-js/faker";

import type {
  MockDataFn,
  MockDataFns,
  MockDataRequest,
  MockDataResult,
} from "@/features/mock-data/mock-data.type.ts";

const MAX_OBJECTS = 10_000;

function keyToFn(key: string) {
  return (
    key
      ?.split(".")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc, k) => (acc as Record<string, any>)[k], faker as object) as MockDataFn
  );
}

function requestToFnsObject(data: MockDataRequest): MockDataFns {
  const result: MockDataFns = {};
  for (const key of Object.keys(data)) {
    if (!data[key]) continue;
    const fn = keyToFn(data[key]);
    if (fn) result[key] = fn;
  }
  return result;
}

async function generateMockData(fns: MockDataFns) {
  const result: MockDataResult = {};
  for (const key of Object.keys(fns)) {
    if (!fns[key]) continue;
    result[key] = await fns[key]?.();
  }
  return result;
}

export async function generateMockDataList(data: MockDataRequest): Promise<MockDataResult[]> {
  const { __count, ...input } = data;
  const fns = requestToFnsObject(input);
  let count = Number(__count);
  if (count !== 0 && !count) return [await generateMockData(fns)];
  if (count < 0) count = 0;
  if (count > MAX_OBJECTS) count = MAX_OBJECTS;
  const resultPromises = [];
  for (let i = 0; i < count; i++) {
    resultPromises.push(generateMockData(fns));
  }
  return await Promise.all(resultPromises);
}
