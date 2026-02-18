const CONSONANTS = "bcdfghjklmnprstvwxz";
const VOWELS = "aeiou";

const randomIndex = (max: number): number => {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0]! % max;
};

const randomChar = (chars: string): string => chars[randomIndex(chars.length)]!;

const generateSyllables = (count: number): string => {
  let result = "";
  for (let i = 0; i < count; i++) {
    result += randomChar(CONSONANTS);
    result += randomChar(VOWELS);
  }
  return result;
};

export type SeparatorStyle = "none" | "underscore" | "hyphen" | "dot";

const SEPARATOR_MAP: Record<SeparatorStyle, string> = {
  none: "",
  underscore: "_",
  hyphen: "-",
  dot: ".",
};

export interface UsernameOptions {
  syllableCount: number;
  includeNumbers: boolean;
  separator: SeparatorStyle;
  capitalize: boolean;
}

export const DEFAULT_OPTIONS: UsernameOptions = {
  syllableCount: 3,
  includeNumbers: false,
  separator: "none",
  capitalize: false,
};

const generateDigits = (count: number): string => {
  let result = "";
  for (let i = 0; i < count; i++) {
    result += String(randomIndex(10));
  }
  return result;
};

export const generateUsername = (options: UsernameOptions): string => {
  const sep = SEPARATOR_MAP[options.separator];
  let name: string;

  if (sep) {
    // Split syllables roughly in half across two parts
    const half = Math.max(1, Math.floor(options.syllableCount / 2));
    const rest = Math.max(1, options.syllableCount - half);
    name = generateSyllables(half) + sep + generateSyllables(rest);
  } else {
    name = generateSyllables(options.syllableCount);
  }

  if (options.capitalize) {
    name = name[0]!.toUpperCase() + name.slice(1);
  }

  if (options.includeNumbers) {
    const digitCount = 2 + randomIndex(3); // 2-4 digits
    name += generateDigits(digitCount);
  }

  return name;
};

export const generateUsernames = (options: UsernameOptions, count: number = 8): string[] => {
  return Array.from({ length: count }, () => generateUsername(options));
};
