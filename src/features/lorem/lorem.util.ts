import { MAX_WORD_COUNT, MIN_WORD_COUNT } from "@/features/lorem/lorem.constant.ts";
import { clamp } from "@/utils/common.util.ts";
import { faker } from "@faker-js/faker";

export const generateLoremWords = (wordCount: number): string => {
  return faker.lorem.words(Number(clamp(wordCount, MIN_WORD_COUNT, MAX_WORD_COUNT)) || 3);
};
