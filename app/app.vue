<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator/>
      <!--
        `key` is required to workaround/fix an issue
        https://github.com/nuxt/framework/issues/3141#issuecomment-1206647930
      -->
      <NuxtPage :key="$route.fullPath"/>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useI18n } from "#i18n"
import { computed } from "vue"

const I18n = useI18n()
const I18nGlobal = useI18n({ useScope: 'global' })
// Mainly for debugging
const currentGlobalLocaleCode = I18nGlobal.locale
const { t } = useI18n()
const locales = I18nGlobal.locales.value
const currentLocale = computed(() => locales.find((locale) => locale.code === currentGlobalLocaleCode.value))

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${t("meta.title")}` : t("meta.title");
  },
  meta: [
    { name: 'description', content: t("meta.description") }
  ],
  htmlAttrs: {
    lang: currentLocale.value.iso,
  },
})

watch(
  currentLocale,
  () => {
    useHead({
      htmlAttrs: {
        lang: currentLocale.value.iso,
      },
    })
  },
)

// Force dark mode
definePageMeta({
  colorMode: "dark",
})
</script>

<style lang="scss">
.shiki .line {
  // Since unknown version default style become display: inline-block
  display: block;
}
</style>

<i18n lang="yaml">
en:
  meta:
    title: PikaSer
    description: PikaSer - A Cosmos Validator

zh:
  meta:
    title: PikaSer
    description: PikaSer - A Cosmos Validator
</i18n>
