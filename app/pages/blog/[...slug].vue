<template>
  <template v-if="data">
    <h1>{{ data.title }}</h1>
    <ContentRenderer :value="data" v-if="data" />
  </template>
  <template v-if="!data">
    <h1>Document not found</h1>
  </template>
</template>

<script setup>
const route = useRoute()

const { data } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})

useSeoMeta({
  title: data.value?.title,
  description: data.value?.description
})
</script>
