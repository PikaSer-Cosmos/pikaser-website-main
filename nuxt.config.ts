import { defineNuxtConfig } from "nuxt/config"

// https://nuxt.com/docs/guide/directory-structure/nuxt.config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/color-mode",
    "@nuxt/content",
    "@nuxtjs/i18n",
    "@nuxt/ui",
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxt/devtools",
  ],

  css: [
    "github-markdown-css/github-markdown-dark.css",
  ],

  colorMode: {
    preference: "dark",
    fallback:   "dark",

    // default is "-mode"
    classSuffix: "",
  },

  content: {
    highlight: {
      theme: {
        default:  "github-dark",
        dark:     "github-dark",
      }
    }
  },

  // https://github.com/nuxt/framework/issues/5200
  // https://github.com/nuxt/framework/discussions/4071
  // components: {
  //   "dirs": [
  //     {
  //       "path": "~/components/global",
  //       "global": true
  //     },
  //     "~/components"
  //   ]
  // },

  i18n: {
    locales: [
      {
        code: "en",
        iso:  "en",
        name: "English",
        file: "en.js",
      },
      {
        code: "zh",
        iso:  "zh-Hant",
        name: "正體中文",
        file: "zh.js",
      },
    ],
    defaultLocale:  "en",

    strategy:       "prefix",

    // Redirect seem malfunctioning
    // detectBrowserLanguage: false,
    detectBrowserLanguage: {
      alwaysRedirect: false,
      fallbackLocale: "en",
      redirectOn:     "root",
    },

    vueI18n: './i18n.config.ts',

    // Per component I18n
    vueI18nLoader: true,

    langDir: "locales",
  },

  // Enable Client-side only rendering
  ssr: false,

  // Enable devtool
  // Since nuxt 3.4
  devtools: {
    enabled: true,
  }
})
