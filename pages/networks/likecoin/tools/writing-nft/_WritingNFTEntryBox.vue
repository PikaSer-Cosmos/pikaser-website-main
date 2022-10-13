<template>
  <article class="writing-nft-entry-box" v-if="entry_visible">
    <div class="writing-nft-entry-box__main-content">
      <h3 class="text-lg">
        <a :href="props.nft_class.metadata.external_url || `https://liker.land/nft/class/${props.nft_class.id}`" target="_blank" rel="noreferrer noopener">
          {{ props.nft_class.metadata.name || props.nft_class.name.replace("Writing NFT - ", "") }}
        </a>
      </h3>
      <p class="mt-4">
        <a :href="`https://liker.land/nft/class/${props.nft_class.id}`" target="_blank" rel="noreferrer noopener">
          {{ t("NFT Page on Liker Land") }}
        </a>
        <span> - </span>
        <span>{{ dayjs(props.nft_class.created_at).format("YYYY-MM-DD HH:mm:ss") }}</span>
        <span> - </span>
        <a :href="`https://app.like.co/view/${encodeURIComponent(props.nft_class.parent.iscn_id_prefix)}`" target="_blank" rel="noreferrer noopener">
          {{ t("On-Chain Data") }}
        </a>
      </p>
      <p class="mt-4">
        <span>
          {{ t("Current Price") }}
          <span>: </span>
          <span v-if="class_purchase_data_loading">...</span>
          <strong v-else-if="class_purchase_data_error != null">???</strong>
          <strong v-else>{{ class_purchase_data.price }} $LIKE</strong>
        </span>
        <span> - </span>
        <span>
          {{ t("Sold") }}
          <span>: </span>
          <span v-if="class_purchase_data_loading">...</span>
          <strong v-else-if="class_purchase_data_error != null">???</strong>
          <strong v-else>{{ class_purchase_data.metadata.soldCount }}</strong>
        </span>
      </p>
      <section class="mt-4">
        <p>
          {{ t("ISCN Owner") }}
          <span> - </span>
          <span v-if="class_metadata_loading">...</span>
          <strong v-else-if="class_metadata_error != null">???</strong>
          <span v-else>
            <a :href="`https://liker.land/${class_metadata.iscn_owner}`" target="_blank" rel="noreferrer noopener">
              <strong>{{ class_metadata.iscn_owner }}</strong>
              <span v-if="!iscn_owner_data_loading && iscn_owner_data != null">
                ({{ iscn_owner_data.displayName }})
              </span>
            </a>
          </span>
        </p>
        <section
          v-if="class_metadata_valid"
          class="mt-4 vertical-middle space-x-1"
        >
          <NButton
            icon="carbon:filter"
            n="green xs"
            @click="emit('filter_by_creator_address', class_metadata.iscn_owner)"
          >
            {{ t("View NFTs by This Creator") }}
          </NButton>
          <NButton
            v-if="creator_bookmarked != null && !creator_bookmarked"
            icon="carbon:bookmark-add"
            n="green xs"
            @click="emit('bookmark_creator_address', class_metadata.iscn_owner)"
          >
            {{ t("Bookmark This Creator") }}
          </NButton>
          <NButton
            v-if="creator_bookmarked != null && creator_bookmarked"
            icon="carbon:trash-can"
            n="red xs"
            @click="emit('unbookmark_creator_address', class_metadata.iscn_owner)"
          >
            {{ t("Unbookmark This Creator") }}
          </NButton>
          <NButton
            v-if="creator_bookmarked != null && !creator_blocked"
            icon="carbon:close-filled"
            n="red xs"
            @click="emit('block_creator_address', class_metadata.iscn_owner)"
          >
            {{ t("Block This Creator") }}
          </NButton>
        </section>
      </section>
      <p class="mt-4 break-all">
        {{ props.nft_class.description }}
      </p>
      <p class="mt-4" v-if="!class_metadata_loading && class_metadata_error == null">
        <img :src="class_metadata.image" loading="lazy" />
      </p>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from '#i18n'
import { useAsyncData } from "#imports"
import dayjs from 'dayjs'

interface ClassMetadata {
  iscn_owner: string
}

const emit = defineEmits<{
  (e: 'filter_by_creator_address', address: string): void

  (e: 'bookmark_creator_address', address: string): void
  (e: 'unbookmark_creator_address', address: string): void

  (e: 'block_creator_address', address: string): void
}>()

const I18n = useI18n()
const { t } = I18n

const props = defineProps({
  nft_class: {
    type: Object,
    validator(value: {[key: string]: unknown}) {
      const val_obj_keys = Object.keys(value)

      return ["id", "metadata", "created_at"].every((expected_key) => {
        return (val_obj_keys).includes(expected_key)
      })
    },
  },

  only_writing_nft_with_complete_data_visible_input: {
    type: Boolean,
  },

  all_bookmarked_creator_addresses: {
    type: Set,
  },
  only_writing_nft_from_bookmarked_creator_visible: {
    type: Boolean,
  },

  all_blocked_creator_addresses: {
    type: Set,
  },
})

const {
  pending: class_purchase_data_loading,
  data: class_purchase_data,
  error: class_purchase_data_error,
} = useAsyncData(
  [
    "class_purchase_data",
    props.nft_class.id,
  ].join("/"),
  (() => {
    // https://docs.like.co/developer/likenft/api-reference
    return $fetch(
      "https://api.like.co/likernft/purchase",
      {
        params: {
          class_id: props.nft_class.id,
        },
      }
    )
  })
)
const class_purchase_data_valid = computed<boolean>(() => !class_purchase_data_loading.value && class_purchase_data_error.value == null)

const fetch_class_metadata_promise = $fetch<ClassMetadata>(
  "https://api.like.co/likernft/metadata",
  {
    params: {
      iscn_id: props.nft_class.parent.iscn_id_prefix,
    },
  }
)

const {
  pending:  class_metadata_loading,
  data:     class_metadata,
  error:    class_metadata_error,
} = useAsyncData(
  [
    "class_metadata",
    props.nft_class.parent.iscn_id_prefix,
  ].join("/"),
  (() => {
    // https://docs.like.co/developer/likenft/api-reference
    return fetch_class_metadata_promise
  })
)
const class_metadata_valid = computed<boolean>(() => !class_metadata_loading.value && class_metadata_error.value == null)

const creator_bookmarked = computed<boolean>(() => {
  if (class_metadata_valid.value) {
    return props.all_bookmarked_creator_addresses.has(class_metadata.value.iscn_owner)
  }

  return false
})

const creator_blocked = computed<boolean>(() => {
  if (class_metadata_valid.value) {
    return props.all_blocked_creator_addresses.has(class_metadata.value.iscn_owner)
  }

  return false
})

const {
  pending:  iscn_owner_data_loading,
  data:     iscn_owner_data,
  error:    iscn_owner_data_error,
} = useAsyncData(
  [
    "iscn_owner_data",
    props.nft_class.parent.iscn_id_prefix,
  ].join("/"),
  (() => {
    return fetch_class_metadata_promise
    .then((class_metadata_2) => {
      return $fetch(
        `https://api.like.co/users/addr/${class_metadata_2.iscn_owner}/min`,
      )
    })
  })
)


const entry_visible = computed<boolean>(() => {
  if (props.only_writing_nft_with_complete_data_visible_input && !class_purchase_data_valid.value) {
    return false
  }

  if (creator_blocked.value) {
    return false
  }

  if (props.only_writing_nft_from_bookmarked_creator_visible) {
    return creator_bookmarked.value
  }

  return true
})

</script>


<style lang="scss" scoped>

.writing-nft-entry-box {
  padding-top: 1rem;
  padding-bottom: 1rem;

  display: flex;
  flex: 1;
  justify-content: center;

  &:first-child {
    // Avoid unexpected spacing
    padding-top: 0;
  }

  &__main-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
  }
  &__image {
    margin-left: auto;

    img {
      height: 100px;
    }
  }
}

</style>


<i18n lang="yaml">
en:
  NFT Page on Liker Land: NFT Page on Liker Land
  On-Chain Data: On-Chain Data
  Current Price: Current Price
  Sold: Sold
  ISCN Owner: ISCN Owner

  View NFTs by This Creator: View NFTs by This Creator
  Bookmark This Creator: Bookmark This Creator
  Unbookmark This Creator: Unbookmark This Creator
  Block This Creator: Block This Creator

zh:
  NFT Page on Liker Land: Liker Land上的NFT頁面
  On-Chain Data: LikeCoin鏈上資料
  Current Price: 現時價格
  Sold: 已賣出
  ISCN Owner: ISCN 擁有者

  View NFTs by This Creator: 只看此創造者的NFT
  Bookmark This Creator: 將此創造者加入書籤清單
  Unbookmark This Creator: 將此創造者踢出書籤清單
  Block This Creator: 將此創造者加入封鎖清單
</i18n>
