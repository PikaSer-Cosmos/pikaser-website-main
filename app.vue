<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
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
