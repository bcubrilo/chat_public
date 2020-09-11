import Vue from "vue";
import VueI18n from "vue-i18n";
// import messages from "@/locales/en.json";
import { languages } from "./locales";
import Vuex from "vuex";
import store from "./store";

const messages = Object.assign(languages);

Vue.use(VueI18n);

const loadedLanguages = ["en"];

export const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "en",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: messages
});

function setI18nLanguage(lang) {
  i18n.locale = lang;
  return lang;
}

// export function loadLanguageAsync(lang) {
//   console.log("Called for ", lang);
//   // If the same language
//   if (i18n.locale === lang) {
//     return Promise.resolve(setI18nLanguage(lang));
//   }

//   // If the language was already loaded
//   if (loadedLanguages.includes(lang)) {
//     return Promise.resolve(setI18nLanguage(lang));
//   }

//   // If the language hasn't been loaded yet
//   return import(
//     /* webpackChunkName: "lang-[request]" */ `@/locales/${lang}.json`
//   ).then(messages => {
//     i18n.setLocaleMessage(lang, messages);
//     loadedLanguages.push(lang);
//     return setI18nLanguage(lang);
//   });
// }

// function loadLocaleMessages() {
//   const locales = require.context(
//     "./locales",
//     true,
//     /[A-Za-z0-9-_,\s]+\.json$/i
//   );
//   const messages = {};
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i);
//     if (matched && matched.length > 1) {
//       const locale = matched[1];
//       messages[locale] = locales(key);
//     }
//   });
//   return messages;
// }
