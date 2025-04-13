import { ru } from "./ru";
import { en } from "./en";
import { de } from "./de";
import { fr } from "./fr";
import { ja } from "./ja";
import { zh } from "./zh";
import { ar } from "./ar";
import { tr } from "./tr";
import { fa } from "./fa";

const dictionaries = {
  ru,
  en,
  de,
  fr,
  ja,
  zh,
  ar,
  tr,
  fa,
};

export type Dictionary = typeof en;

export const getDictionary = (locale: string): Dictionary => {
  if (!Object.keys(dictionaries).includes(locale)) {
    return dictionaries.en;
  }
  return dictionaries[locale as keyof typeof dictionaries];
};
