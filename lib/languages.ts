export const languages = [
  { code: "ru", name: "Русский" },
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
  { code: "tr", name: "Türkçe" },
  { code: "fa", name: "فارسی" },
];

export const languageCodes = languages.map((lang) => lang.code);

export const defaultLanguage = "en";

export const rtlLanguages = ["ar", "fa"];
