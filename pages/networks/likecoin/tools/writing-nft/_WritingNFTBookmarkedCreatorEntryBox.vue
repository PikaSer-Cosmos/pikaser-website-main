<template>
  <div class="entry-box">
    <span
      class="entry-box__creator-info"
    >
      <a :href="`https://liker.land/${creator_address}`" target="_blank" rel="noreferrer noopener">
        <strong>{{ creator_address }}</strong>
        <span v-if="iscn_owner_data_ready">
          ({{ iscn_owner_data.displayName }})
        </span>
      </a>
    </span>
    <span
      class="entry-box__actions"
    >
      <NButton
        icon="carbon:filter"
        n="green xs"
        @click="emit('filter_by_creator_address', creator_address)"
      >
        {{ t("Filter NFTs") }}
      </NButton>
      <NButton
        icon="carbon:trash-can"
        n="red xs"
        @click="emit('unbookmark_creator_address', creator_address)"
      >
        {{ t("Unbookmark") }}
      </NButton>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from '#i18n'
import { useAsyncData } from "nuxt/app"

const emit = defineEmits<{
  (e: 'filter_by_creator_address', address: string): void

  (e: 'unbookmark_creator_address', address: string): void
}>()

const I18n = useI18n()
const { t } = I18n

const props = defineProps({
  creator_address: {
    type: String,
  },
})

const {
  pending:  iscn_owner_data_loading,
  data:     iscn_owner_data,
  error:    iscn_owner_data_error,
} = useAsyncData(
  [
    "iscn_owner_data",
    props.creator_address,
  ].join("/"),
  (() => {
    return $fetch(
      `https://api.like.co/users/addr/${props.creator_address}/min`,
    )
  })
)
const iscn_owner_data_ready = computed(() => {
  return !iscn_owner_data_loading.value && iscn_owner_data_error.value == null
})

</script>


<style lang="scss" scoped>

.entry-box {
  display: flex;
  flex: 1;
  justify-content: center;

  &:first-child {
    // Avoid unexpected spacing
    padding-top: 0;
  }

  &__creator-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
  }
  &__actions {
    margin-left: 1em;

    > * {
      margin-left: 1em;

      &:first-child {
        margin-left: 0;
      }
    }
  }
}

</style>


<i18n lang="yaml">
en:
  Filter NFTs: Filter NFTs
  Unbookmark: Unbookmark

zh:
  Filter NFTs: 查看他的NFT
  Unbookmark: 踢出清單
</i18n>
