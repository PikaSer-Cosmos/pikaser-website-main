<template>
  <NuxtImg :src="src" :alt="alt" :width="width" :height="height" :placeholder="nPlaceholder" />
</template>

<script setup lang="ts">
// import { reactive, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  },
  placeholder: {
    type: [Boolean, String, Number, Array],
    default: undefined
  },
})

// This is needed due to Markdown unable to pass array
const nPlaceholder = computed(() => {
  if (typeof props.placeholder !== "string") { return props.placeholder }

  if (! props.placeholder.match(/\d+(,\d){1,2}/)) { return props.placeholder }

  return props.placeholder.split(",").map((s) => s.trim())
})
</script>
