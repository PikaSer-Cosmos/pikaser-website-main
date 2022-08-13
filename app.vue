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

const { t } = useI18n()

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${t("meta.title")}` : t("meta.title");
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset:  'utf-8',
  meta: [
    { name: 'description', content: t("meta.description") }
  ],
})

// Force dark mode
const colorMode = useColorMode()
colorMode.preference = "dark"
</script>

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
