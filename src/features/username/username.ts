const SIMPLE_ONSETS = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "z",
];

const CLUSTER_ONSETS = [
  "bl",
  "br",
  "cl",
  "cr",
  "dr",
  "fl",
  "fr",
  "gl",
  "gr",
  "pl",
  "pr",
  "sc",
  "sk",
  "sl",
  "sm",
  "sn",
  "sp",
  "st",
  "str",
  "sw",
  "tr",
  "tw",
  "qu",
  "sh",
  "ch",
  "th",
  "wh",
];

const VOWEL_CORES = [
  // singles (weighted more heavily by repeating)
  "a",
  "e",
  "i",
  "o",
  "u",
  "a",
  "e",
  "i",
  "o",
  "u",
  "a",
  "e",
  "o",
  // diphthongs & digraphs
  "ai",
  "au",
  "ea",
  "ei",
  "ia",
  "io",
  "ou",
  "oo",
  "ee",
];

const SIMPLE_CODAS = ["b", "d", "f", "g", "k", "l", "m", "n", "p", "r", "s", "t", "x", "z"];

const CLUSTER_CODAS = [
  "ct",
  "ft",
  "lk",
  "lt",
  "mp",
  "nd",
  "ng",
  "nk",
  "nt",
  "pt",
  "rb",
  "rd",
  "rk",
  "rm",
  "rn",
  "rp",
  "rs",
  "rt",
  "sk",
  "sp",
  "st",
];

// --- Utility ---

const randomIndex = (max: number): number => {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0]! % max;
};

const pick = <T>(items: T[]): T => items[randomIndex(items.length)]!;

/**
 * Generate a single syllable with configurable complexity.
 *
 * Structure: [onset] + vowel-core + [coda]
 *
 * @param allowClusterOnset  Allow multi-char onsets like "str", "ch"
 * @param allowCoda          Allow a trailing consonant / cluster
 * @param codaChance         0-1 probability of adding a coda when allowed
 */
const generateSyllable = (
  allowClusterOnset: boolean,
  allowCoda: boolean,
  codaChance: number,
): string => {
  let syl = "";

  // Onset (90 % chance to have one)
  if (randomIndex(100) < 90) {
    if (allowClusterOnset && randomIndex(100) < 30) {
      syl += pick(CLUSTER_ONSETS);
    } else {
      syl += pick(SIMPLE_ONSETS);
    }
  }

  // Vowel core (always present)
  syl += pick(VOWEL_CORES);

  // Coda
  if (allowCoda && randomIndex(100) < codaChance * 100) {
    if (randomIndex(100) < 25) {
      syl += pick(CLUSTER_CODAS);
    } else {
      syl += pick(SIMPLE_CODAS);
    }
  }

  return syl;
};

/**
 * Build a pronounceable word from `count` syllables.
 *
 * Applies contextual rules:
 *  - First syllable may use cluster onsets, rarely has a coda
 *  - Middle syllables are simpler to keep flow smooth
 *  - Last syllable may end with a coda for a strong finish
 */
const generateSyllables = (count: number): string => {
  let result = "";
  for (let i = 0; i < count; i++) {
    const isFirst = i === 0;
    const isLast = i === count - 1;

    const allowCluster = isFirst || randomIndex(100) < 20;
    const allowCoda = isLast || randomIndex(100) < 25;
    const codaChance = isLast ? 0.5 : 0.2;

    result += generateSyllable(allowCluster, allowCoda, codaChance);
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
