<template>
  <div
    class="max-w-3xl max-w-5xlmin-h-screen flex justify-center mx-auto my-12"
  >
    <article class="w-full">
      <h1 class="text-2xl font-semibold mb-6">{{ t("Writing NFT Tools") }}</h1>
      <section>
        <h2 class="text-xl font-semibold mb-4">{{ t("Recent Writing NFTs") }}</h2>
        <section class="mt-4 space-y-2">
          <section>
            <label for="recent_writing_nfts_data_pagination_limit_select">
              {{ t("Display at most") }}:
            </label>
            <select v-model="recent_writing_nfts_data_pagination_limit" id="recent_writing_nfts_data_pagination_limit_select">
              <option v-for="recent_writing_nfts_data_pagination_limit_option in recent_writing_nfts_data_pagination_limit_options" :value="recent_writing_nfts_data_pagination_limit_option">
                {{ recent_writing_nfts_data_pagination_limit_option }}
              </option>
            </select>
          </section>
          <section>
            <label for="recent_writing_nfts_data_time_limit_in_days_select">
              {{ t("In last N days") }}:
            </label>
            <select v-model="recent_writing_nfts_data_time_limit_in_days" id="recent_writing_nfts_data_time_limit_in_days_select">
              <option v-for="recent_writing_nfts_data_time_limit_in_days_option in recent_writing_nfts_data_time_limit_in_days_options" :value="recent_writing_nfts_data_time_limit_in_days_option">
                {{ recent_writing_nfts_data_time_limit_in_days_option }}
              </option>
            </select>
          </section>
          <section>
            <NTextInput
              icon="carbon:person"
              :placeholder='t("Creator")'
              v-model="recent_writing_nfts_data_creator_address"
            />
          </section>
          <section>
            <NTextInput
              icon="carbon:person-favorite"
              :placeholder='t("Collector")'
              v-model="recent_writing_nfts_data_collector_address"
            />
          </section>
        </section>
        <section class="pt-4 mt-4 border-t-1">
          <div v-if="recent_writing_nfts_data_loading">
            <p>
              {{ t("Loading...") }}
            </p>
          </div>
          <div v-else>
            <div class="divide-y">
              <WritingNFTEntryBox
                v-for="nft_class of all_recent_writing_nft_class_entries"
                :key="nft_class.id"
                :nft_class="nft_class"
                @filter_by_creator_address="(address) => recent_writing_nfts_data_creator_address = address"
              />
            </div>
            <div>
              <NButton
                class="w-full text-center"
                :disabled="!load_more_button_enabled"
                :icon="more_nft_being_loaded ? 'carbon:time' : 'carbon:search-advanced'"
                n="green solid"
                @click="load_more_recent_writing_nft_class_entries()"
              >
                {{ load_more_button_text }}
              </NButton>
            </div>
          </div>
        </section>
      </section>
    </article>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import { useI18n } from '#i18n'
import { useAsyncData } from "nuxt/app"
import dayjs from 'dayjs'

import WritingNFTEntryBox from './_WritingNFTEntryBox.vue'

const I18n = useI18n()
const { t } = useI18n()


useHead({
  title:  t("meta.title"),
  meta:   [
    {
      name: 'description',
      content: t("meta.title"),
    },
  ]
})


const recent_writing_nfts_data_pagination_limit_options = [
  25,
  50,
  100,
]
const recent_writing_nfts_data_pagination_limit = ref(recent_writing_nfts_data_pagination_limit_options[0])

const recent_writing_nfts_data_time_limit_in_days_options = [
  7,
  14,
  21,
  28,
]
const recent_writing_nfts_data_time_limit_in_days = ref(recent_writing_nfts_data_time_limit_in_days_options[0])

const recent_writing_nfts_data_creator_address = ref('')
const recent_writing_nfts_data_collector_address = ref('')

const {
  pending: recent_writing_nfts_data_loading,
  data: recent_writing_nft_class_entries,
} = useAsyncData(
  [
    "recent_writing_nfts_data",
  ].join("/"),
  (() => {
    const earliest_time_in_unix_time = dayjs().subtract(recent_writing_nfts_data_time_limit_in_days.value, 'days').unix()

    // https://docs.like.co/developer/likenft/api-reference
    return $fetch(
      "https://mainnet-node.like.co/likechain/likenft/v1/ranking",
      {
        params: {
          after:      earliest_time_in_unix_time,
          limit:      recent_writing_nfts_data_pagination_limit.value,
          creator:    recent_writing_nfts_data_creator_address.value,
          collector:  recent_writing_nfts_data_collector_address.value,
        },
      }
    )
  }),
  {
    watch: [
      recent_writing_nfts_data_pagination_limit,
      recent_writing_nfts_data_time_limit_in_days,
      recent_writing_nfts_data_creator_address,
      recent_writing_nfts_data_collector_address,
    ],
    default: () => {
      return []
    },
    transform: ((data) => {
      return data.classes.map((nft_class) => {
        nft_class.created_at_in_unix = dayjs(nft_class.created_at).unix()
        return nft_class
      })
      .sort((a, b) => b.created_at_in_unix - a.created_at_in_unix)
    }),
  }
)

const all_recent_writing_nft_class_entries = ref(recent_writing_nft_class_entries)
const earliest_writing_nft_created_at_in_unix = computed(() => {
  return all_recent_writing_nft_class_entries.value.at(-1).created_at_in_unix
})
const more_nft_being_loaded = ref(false)
const more_nft_can_be_loaded = ref(true)

const load_more_button_enabled = ref(true)
const load_more_button_text = computed(() => {
  if (more_nft_being_loaded.value) {
    return t("Loading More...")
  }

  if (load_more_button_enabled.value) {
    return t("Is There More～")
  }

  // Probably nothing left
  return t("Nothing left...")
})

function load_more_recent_writing_nft_class_entries() {
  // Disable button, but not hide it
  load_more_button_enabled.value = false
  more_nft_being_loaded.value = true

  const earliest_time_in_unix_time =
    dayjs.unix(earliest_writing_nft_created_at_in_unix.value)
    .subtract(recent_writing_nfts_data_time_limit_in_days.value, 'days')
    .unix()

  $fetch(
    "https://mainnet-node.like.co/likechain/likenft/v1/ranking",
    {
      params: {
        before:     earliest_writing_nft_created_at_in_unix.value,
        after:      earliest_time_in_unix_time,
        limit:      recent_writing_nfts_data_pagination_limit.value,
        creator:    recent_writing_nfts_data_creator_address.value,
        collector:  recent_writing_nfts_data_collector_address.value,
      },
    }
  )
  .then((data) => {
    // "Flatten" it to array
    if (data.classes == null) { return [] }

    return data.classes.map((nft_class) => {
      nft_class.created_at_in_unix = dayjs(nft_class.created_at).unix()
      return nft_class
    })
    .sort((a, b) => b.created_at_in_unix - a.created_at_in_unix)
  })
  .then((nft_classes) => {
    all_recent_writing_nft_class_entries.value = all_recent_writing_nft_class_entries.value.concat(nft_classes)
    // Disable button AND hide it if it seems to be end of all entries
    load_more_button_enabled.value  = nft_classes.length !== 0
    more_nft_can_be_loaded.value    = nft_classes.length !== 0
  })
  .catch(() => {
    // For retry
    load_more_button_enabled.value = true
  })
  .finally(() => {
    more_nft_being_loaded.value = false
  })
}

</script>

<style lang="scss">

a {
  color: yellow;

  // This state uses darker color
  // The rule must be put on top
  &:visited {
    color: lighten(orange, 10%);
  }
  &:active ,
  &:hover {
    color: orange;
  }
}


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
  meta:
    title: "LikeCoin Writing NFT Tools"

  Writing NFT Tools: Writing NFT Tools
  Recent Writing NFTs: Recent Writing NFTs

  Display at most: Display at most
  In last N days: In last N days
  Creator: Creator
  Collector: Collector

  Loading...: Loading...

  Is There More～: Is There More～
  Loading More...: Loading More...
  Nothing left...: Nothing left...

zh:
  meta:
    title: "LikeCoin Writing NFT 工具"

  Writing NFT Tools: Writing NFT 工具
  Recent Writing NFTs: 最近的 Writing NFT

  Display at most: 顯示最多
  In last N days: 限最近多少日
  Creator: 創造者
  Collector: 收藏者

  Loading...: 蕉蕉發電中…

  Is There More～: 還有更多嗎～
  Loading More...: 正在尋找更多…
  Nothing left...: 然後就沒有然後了…
</i18n>
