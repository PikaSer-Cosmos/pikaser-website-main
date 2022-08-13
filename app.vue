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
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - PikaSer` : 'PikaSer';
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset:  'utf-8',
  meta: [
    { name: 'description', content: 'PikaSer - A Cosmos Validator' }
  ],
})

// Force dark mode
const colorMode = useColorMode()
colorMode.preference = "dark"
</script>
