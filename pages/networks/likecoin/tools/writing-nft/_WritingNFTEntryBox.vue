<template>
  <article class="writing-nft-entry-box">
    <div class="writing-nft-entry-box__main-content">
      <h3 class="text-lg">
        <a :href="nft_class.metadata.external_url || `https://liker.land/nft/class/${nft_class.id}`" target="_blank" rel="noreferrer noopener">
          {{ nft_class.metadata.name || nft_class.name.replace("Writing NFT - ", "") }}
        </a>
      </h3>
      <p class="mt-4">
        <a :href="`https://liker.land/nft/class/${nft_class.id}`" target="_blank" rel="noreferrer noopener">
          {{ t("NFT Page on Liker Land") }}
        </a>
        <span> - </span>
        <span>{{ dayjs(nft_class.created_at).format("YYYY-MM-DD") }}</span>
        <span> - </span>
        <a :href="`https://app.like.co/view/${encodeURIComponent(nft_class.parent.iscn_id_prefix)}`" target="_blank" rel="noreferrer noopener">
          {{ t("On-Chain Data") }}
        </a>
      </p>
      <p class="mt-4">
        {{ t("Current Price") }}
        <span> - </span>
        <span v-if="class_purchase_data_loading">...</span>
        <strong v-else-if="class_purchase_data_error != null">???</strong>
        <strong v-else>{{ class_purchase_data.price }} $LIKE</strong>
      </p>
      <p class="mt-4">
        {{ t("Sold") }}
        <span> - </span>
        <span v-if="class_purchase_data_loading">...</span>
        <strong v-else-if="class_purchase_data_error != null">???</strong>
        <strong v-else>{{ class_purchase_data.metadata.soldCount }}</strong>
      </p>
      <p class="mt-4">
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
          <NButton
            class="ml-2"
            icon="carbon:filter"
            n="green xs"
            @click="emit('filter_by_creator_address', class_metadata.iscn_owner)"
          >
            {{ t("View NFTs by This Creator") }}
          </NButton>
        </span>
      </p>
      <p class="mt-4">
        {{ nft_class.description }}
      </p>
      <p class="mt-4" v-if="!class_metadata_loading && class_metadata_error == null">
        <img :src="class_metadata.image" loading="lazy" />
      </p>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { useI18n } from '#i18n'
import { useAsyncData } from "nuxt/app"
import dayjs from 'dayjs'

interface ClassMetadata {
  iscn_owner: string
}

const emit = defineEmits<{
  (e: 'filter_by_creator_address', address: string): void
}>()

const I18n = useI18n()
const { t } = I18n

const { nft_class } = defineProps({
  nft_class: {
    type: Object,
    validator(value: {[key: string]: unknown}) {
      const val_obj_keys = Object.keys(value)

      return ["id", "metadata", "created_at"].every((expected_key) => {
        return (val_obj_keys).includes(expected_key)
      })
    },
  },
})

const {
  pending: class_purchase_data_loading,
  data: class_purchase_data,
  error: class_purchase_data_error,
} = useAsyncData(
  [
    "class_purchase_data",
    nft_class.id,
  ].join("/"),
  (() => {
    // https://docs.like.co/developer/likenft/api-reference
    return $fetch(
      "https://api.like.co/likernft/purchase",
      {
        params: {
          class_id: nft_class.id,
        },
      }
    )
  })
)

const fetch_class_metadata_promise = $fetch<ClassMetadata>(
  "https://api.like.co/likernft/metadata",
  {
    params: {
      iscn_id: nft_class.parent.iscn_id_prefix,
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
    nft_class.parent.iscn_id_prefix,
  ].join("/"),
  (() => {
    // https://docs.like.co/developer/likenft/api-reference
    return fetch_class_metadata_promise
  })
)

const {
  pending:  iscn_owner_data_loading,
  data:     iscn_owner_data,
  error:    iscn_owner_data_error,
} = useAsyncData(
  [
    "iscn_owner_data",
    nft_class.parent.iscn_id_prefix,
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

</script>


<i18n lang="yaml">
en:
  NFT Page on Liker Land: NFT Page on Liker Land
  On-Chain Data: On-Chain Data
  Current Price: Current Price
  Sold: Sold
  ISCN Owner: ISCN Owner
  View NFTs by This Creator: View NFTs by This Creator

zh:
  NFT Page on Liker Land: Liker Land上的NFT頁面
  On-Chain Data: LikeCoin鏈上資料
  Current Price: 現時價格
  Sold: 已賣出
  ISCN Owner: ISCN 擁有者
  View NFTs by This Creator: 查看此創造者的NFT
</i18n>
