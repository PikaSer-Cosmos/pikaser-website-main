<template>
  <div
    class="max-w-3xl max-w-5xlmin-h-screen flex justify-center mx-auto my-12"
  >
    <article class="w-full">
      <h1 class="text-2xl font-semibold mb-6">{{ t("Writing NFT Tools") }}</h1>
      <section>
        <h2 class="text-xl font-semibold mb-4">{{ t("Recent Writing NFTs") }}</h2>
        <section class="mt-4 space-y-2">
          <section v-if="recent_writing_nfts_data_pagination_limit_options.length > 1">
            <label for="recent_writing_nfts_data_pagination_limit_select">
              {{ t("Display at most") }}:
            </label>
            <select
              v-model="recent_writing_nfts_data_pagination_limit"
              id="recent_writing_nfts_data_pagination_limit_select"
            >
              <option
                v-for="recent_writing_nfts_data_pagination_limit_option in recent_writing_nfts_data_pagination_limit_options"
                :value="recent_writing_nfts_data_pagination_limit_option"
              >
                {{ recent_writing_nfts_data_pagination_limit_option }}
              </option>
            </select>
          </section>
          <section>
            <label for="recent_writing_nfts_data_time_limit_in_days_select">
              {{ t("In last N days") }}:
            </label>
            <select
              v-model="recent_writing_nfts_data_time_limit_in_days"
              id="recent_writing_nfts_data_time_limit_in_days_select"
            >
              <option
                v-for="recent_writing_nfts_data_time_limit_in_days_option in recent_writing_nfts_data_time_limit_in_days_options"
                :value="recent_writing_nfts_data_time_limit_in_days_option"
              >
                {{ recent_writing_nfts_data_time_limit_in_days_option }}
              </option>
            </select>
          </section>
          <section class="flex">
            <NTextInput
              class="flex-grow-1"
              icon="carbon:person"
              :placeholder='t("NFT Creator")'
              v-model="recent_writing_nfts_data_creator_address"
            />
            <NButton
              class="ml-2 flex-grow-0"
              icon="carbon:clean"
              n="green s"
              @click="recent_writing_nfts_data_creator_address = ''"
            >
              {{ t("Clear") }}
            </NButton>
          </section>
          <section class="flex">
            <NTextInput
              class="flex-grow-1"
              icon="carbon:person-favorite"
              :placeholder='t("NFT Collector")'
              v-model="recent_writing_nfts_data_collector_address"
            />
            <NButton
              class="ml-2 flex-grow-0"
              icon="carbon:link"
              n="purple s"
              @click="read_likecoin_address_from_keplr"
            >
              {{ t("Keplr") }}
            </NButton>
            <NButton
              class="ml-2 flex-grow-0"
              icon="carbon:clean"
              n="green s"
              @click="recent_writing_nfts_data_collector_address = ''"
            >
              {{ t("Clear") }}
            </NButton>
          </section>
          <section>
            <NSwitch
              n="lime6 dark:lime5 sm"
              :model-value="only_writing_nft_with_complete_data_visible_input"
              @update:model-value="(checked) => update_only_writing_nft_with_complete_data_visible_input(checked)"
            >
              {{ t(`Only Show "Complete" NFTs`) }}
            </NSwitch>
            <section>
              <label for="read_writing_nft_class_display_style_input">
                {{ t("Read NFTs Display Style") }}:
              </label>
              <select
                v-model="writingNftOptionsStore.read_writing_nft_class_display_style"
                id="read_writing_nft_class_display_style_input"
              >
                <option
                  v-for="handling_method in ReadWritingNftClassDisplayStyle"
                  :key="handling_method"
                  :value="handling_method"
                >
                  {{ translate_read_writing_nft_class_display_style_option(handling_method) }}
                </option>
              </select>
            </section>
          </section>
          <section
            v-if="writingNftFollowingCreatorAddressListStore.has_any_address"
            class="pt-2 border-t-1"
          >
            <div class="flex flex-1">
              <h3 class="inline-flex">
                {{ t("Bookmarked Creators") }}
              </h3>
              <span
                class="ml-2"
              >
                ({{ writingNftFollowingCreatorAddressListStore.address_list_array.length }})
              </span>
              <NSwitch
                class="ml-2"
                n="lime6 dark:lime5 sm"
                :model-value="writing_nft_bookmarked_creator_list_visible"
                @update:model-value="(checked) => writing_nft_bookmarked_creator_list_visible = checked"
              >
                {{ t("Toggle") }}
              </NSwitch>
              <NSwitch
                class="ml-2"
                n="lime6 dark:lime5 sm"
                :model-value="only_writing_nft_from_bookmarked_creator_visible_input"
                @update:model-value="(checked) => only_writing_nft_from_bookmarked_creator_visible_input = checked"
              >
                {{ t("Only Show Their Created NFTs") }}
              </NSwitch>
            </div>
            <div
              v-if="writing_nft_bookmarked_creator_list_visible"
              class="mt-2"
            >
              <WritingNFTBookmarkedCreatorEntryBox
                v-for="creator_address of writingNftFollowingCreatorAddressListStore.address_list_array"
                :key="creator_address"
                :creator_address="creator_address"
                @filter_by_creator_address="(address) => recent_writing_nfts_data_creator_address = address"
                @unbookmark_creator_address="(address) => writingNftFollowingCreatorAddressListStore.removeOneAddress(address)"
              />
            </div>
          </section>
          <section
            v-if="writingNftBlockingCreatorAddressListStore.has_any_address"
            class="pt-2 border-t-1"
          >
            <div class="flex flex-1">
              <h3 class="inline-flex">
                {{ t("Blocked Creators") }}
              </h3>
              <span
                class="ml-2"
              >
                ({{ writingNftBlockingCreatorAddressListStore.address_list_array.length }})
              </span>
              <NSwitch
                class="ml-2"
                n="lime6 dark:lime5 sm"
                :model-value="writing_nft_blocked_creator_list_visible"
                @update:model-value="(checked) => writing_nft_blocked_creator_list_visible = checked"
              >
                {{ t("Toggle") }}
              </NSwitch>
            </div>
            <div
              v-if="writing_nft_blocked_creator_list_visible"
              class="mt-2"
            >
              <WritingNFTBlockedCreatorEntryBox
                v-for="creator_address of writingNftBlockingCreatorAddressListStore.address_list_array"
                :key="creator_address"
                :creator_address="creator_address"
                @unblock_creator_address="(address) => writingNftBlockingCreatorAddressListStore.removeOneAddress(address)"
              />
            </div>
          </section>
        </section>
        <section class="mt-2 pt-4 border-t-1">
          <div v-if="recent_writing_nfts_data_loading">
            <p>
              {{ t("Loading...") }}
            </p>
          </div>
          <div v-else>
            <div class="mb-4">
              <NButton
                class="w-full text-center"
                :disabled="!load_more_button_enabled"
                :icon="more_nft_being_loaded ? 'carbon:time' : 'carbon:renew'"
                n="green"
                @click="reload_recent_writing_nfts_data()"
              >
                {{ t("Refresh") }}
              </NButton>
            </div>
            <div class="divide-y">
              <WritingNFTEntryBox
                v-for="nft_class of all_recent_writing_nft_class_entries"
                :key="nft_class.id"
                :nft_class="nft_class"
                :only_writing_nft_with_complete_data_visible_input="only_writing_nft_with_complete_data_visible_input"
                :all_bookmarked_creator_addresses="writingNftFollowingCreatorAddressListStore.address_list"
                :only_writing_nft_from_bookmarked_creator_visible="only_writing_nft_from_bookmarked_creator_visible"
                :all_blocked_creator_addresses="writingNftBlockingCreatorAddressListStore.address_list"
                @filter_by_creator_address="(address) => recent_writing_nfts_data_creator_address = address"
                @bookmark_creator_address="(address) => writingNftFollowingCreatorAddressListStore.addOneAddress(address)"
                @unbookmark_creator_address="(address) => writingNftFollowingCreatorAddressListStore.removeOneAddress(address)"
                @block_creator_address="(address) => writingNftBlockingCreatorAddressListStore.addOneAddress(address)"
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

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useI18n } from '#i18n'
import { useAsyncData } from "#imports"
import dayjs from 'dayjs'
import { ChainInfo } from "@keplr-wallet/types"

import WritingNFTEntryBox from './_WritingNFTEntryBox.vue'
import WritingNFTBookmarkedCreatorEntryBox from './_WritingNFTBookmarkedCreatorEntryBox.vue'
import WritingNFTBlockedCreatorEntryBox from './_WritingNFTBlockedCreatorEntryBox.vue'
import {
  useWritingNftOptionsStore,
  ReadWritingNftClassDisplayStyle,
} from "./composables/writing_nft_options"
import { useWritingNftFollowingCreatorAddressListStore } from "./composables/writing_nft_following_creator_list"
import { useWritingNftBlockingCreatorAddressListStore } from "./composables/writing_nft_blocking_creator_list"


interface LikeCoinNftClass {
  "id": string
  "name": string
  "description": string
  "uri": string
  "config": {
    "burnable": boolean
    "max_supply": string
    "blind_box_config": unknown
  },
  "metadata": {
    "image": string
    "description": string
    "external_url": string
    "nft_meta_collection_id": string
    "nft_meta_collection_name": string
    "nft_meta_collection_descrption": string
  },
  "parent": {
    "type": string
    "iscn_id_prefix": string
    "account": string
  },
  "price": number
  "created_at": string
}
type LikeCoinNftClassModified = LikeCoinNftClass & {
  created_at_in_unix: number
}

interface RankingEndpointResponse {
  classes: LikeCoinNftClass[]
  "pagination": {
    "next_key": number,
    "count": number
  }
}


const writingNftOptionsStore = useWritingNftOptionsStore()
const writingNftFollowingCreatorAddressListStore = useWritingNftFollowingCreatorAddressListStore()
const writingNftBlockingCreatorAddressListStore = useWritingNftBlockingCreatorAddressListStore()

const I18n = useI18n()
const { t } = useI18n()

// RPC from https://github.com/likecoin/mainnet
// const likecoin_stargate_client = await StargateClient.connect("https://mainnet-node-rpc.like.co/")


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
  // 50,
  100,
]
const recent_writing_nfts_data_pagination_limit = ref(recent_writing_nfts_data_pagination_limit_options[0])

const recent_writing_nfts_data_time_limit_in_days_options = [
  3,
  7,
  14,
  21,
  28,
]
const recent_writing_nfts_data_time_limit_in_days = ref(7)

const recent_writing_nfts_data_creator_address = ref('')
const recent_writing_nfts_data_collector_address = ref('')

const only_writing_nft_with_complete_data_visible_input = ref(writingNftOptionsStore.only_writing_nft_with_complete_data_visible)
function update_only_writing_nft_with_complete_data_visible_input(val) {
  only_writing_nft_with_complete_data_visible_input.value = val
  writingNftOptionsStore.update_only_writing_nft_with_complete_data_visible(val)
}

function translate_read_writing_nft_class_display_style_option(val: ReadWritingNftClassDisplayStyle): string {
  switch (val) {
    case ReadWritingNftClassDisplayStyle.SAME_AS_UNREAD:
      return t("read_writing_nft_class_display_style.same_as_unread")
    case ReadWritingNftClassDisplayStyle.COLLAPSED:
      return t("read_writing_nft_class_display_style.collapsed")
    case ReadWritingNftClassDisplayStyle.HIDDEN:
      return t("read_writing_nft_class_display_style.hidden")
    default:
      return val
  }
}

const writing_nft_bookmarked_creator_list_visible = ref(false)
const only_writing_nft_from_bookmarked_creator_visible_input = ref(false)
const only_writing_nft_from_bookmarked_creator_visible = computed(() => {
  if (!only_writing_nft_from_bookmarked_creator_visible_input.value) { return false }

  // If no creator bookmarked, disable the feature to avoid having empty list
  // Which can't be turned off easily
  return writingNftFollowingCreatorAddressListStore.has_any_address
})

const writing_nft_blocked_creator_list_visible = ref(false)
const only_writing_nft_from_blocked_creator_visible_input = ref(false)
const only_writing_nft_from_blocked_creator_visible = computed(() => {
  if (!only_writing_nft_from_blocked_creator_visible_input.value) { return false }

  // If no creator blocked, disable the feature to avoid having empty list
  // Which can't be turned off easily
  return writingNftFollowingCreatorAddressListStore.has_any_address
})


// Update this to load data again
const last_initial_recent_writing_nfts_data_loading_started_at = ref(dayjs().unix())
function reload_recent_writing_nfts_data() {
  last_initial_recent_writing_nfts_data_loading_started_at.value = dayjs().unix()
}
let last_used_earliest_time_in_unix_time = null

const {
  pending: recent_writing_nfts_data_loading,
  data: recent_writing_nft_class_entries,
} = useAsyncData<LikeCoinNftClassModified[]>(
  [
    "recent_writing_nfts_data",
  ].join("/"),
  (() => {
    const earliest_time_in_unix_time =
      dayjs().subtract(recent_writing_nfts_data_time_limit_in_days.value, 'days').unix()
    last_used_earliest_time_in_unix_time = earliest_time_in_unix_time

    // https://docs.like.co/developer/likenft/api-reference
    return $fetch<unknown>(
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
      last_initial_recent_writing_nfts_data_loading_started_at,
    ],
    default: (): LikeCoinNftClassModified[] => {
      return []
    },
    transform: ((data): LikeCoinNftClassModified[] => {
      // Save time limit used
      earliest_writing_nft_created_at_limit_searched_in_unix.value =
        last_used_earliest_time_in_unix_time

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
const earliest_writing_nft_created_at_limit_searched_in_unix = ref(Date.now())
const more_nft_being_loaded = ref(false)

const load_more_button_enabled = ref(true)
const load_more_button_text = computed(() => {
  if (more_nft_being_loaded.value) {
    return t("Loading More...")
  }

  if (load_more_button_enabled.value) {
    const text = `${t("Is There More～")}`
    if (earliest_writing_nft_created_at_limit_searched_in_unix.value != null) {
      const formatted_time = dayjs.unix(earliest_writing_nft_created_at_limit_searched_in_unix.value).format("YYYY-MM-DD HH:mm:ss")
      return `${text} (${t("Before Time", {time: formatted_time})})`
    }
    return text
  }

  // Probably nothing left
  return t("Nothing left...")
})

function load_more_recent_writing_nft_class_entries() {
  // Disable button, but not hide it
  load_more_button_enabled.value = false
  more_nft_being_loaded.value = true

  const earliest_time_in_unix_time =
    dayjs.unix(earliest_writing_nft_created_at_limit_searched_in_unix.value)
    .subtract(recent_writing_nfts_data_time_limit_in_days.value, 'days')
    .unix()
  last_used_earliest_time_in_unix_time = earliest_time_in_unix_time

  $fetch<RankingEndpointResponse>(
    "https://mainnet-node.like.co/likechain/likenft/v1/ranking",
    {
      params: {
        before:     earliest_writing_nft_created_at_limit_searched_in_unix.value,
        after:      earliest_time_in_unix_time,
        limit:      recent_writing_nfts_data_pagination_limit.value,
        creator:    recent_writing_nfts_data_creator_address.value,
        collector:  recent_writing_nfts_data_collector_address.value,
      },
    }
  )
  .then((data): LikeCoinNftClassModified[] => {
    // Save time limit used
    earliest_writing_nft_created_at_limit_searched_in_unix.value =
      last_used_earliest_time_in_unix_time

    // "Flatten" it to array
    if (data.classes == null) { return [] }

    return data.classes.map((nft_class) => {
      return Object.assign(
        nft_class,
        {
          created_at_in_unix: dayjs(nft_class.created_at).unix(),
        }
      )
    })
    .sort((a, b) => b.created_at_in_unix - a.created_at_in_unix)
  })
  .then((nft_classes) => {
    all_recent_writing_nft_class_entries.value = all_recent_writing_nft_class_entries.value.concat(nft_classes)
  })
  .finally(() => {
    load_more_button_enabled.value  = true
    more_nft_being_loaded.value = false
  })
}


// https://github.com/likecoin/mainnet/blob/master/keplr.json
const likecoin_chaininfo: ChainInfo = {
  "chainId": "likecoin-mainnet-2",
  "chainName": "LikeCoin",
  "rpc": "https://mainnet-node.like.co/rpc/",
  "rest": "https://mainnet-node.like.co",
  "stakeCurrency": {
    "coinDenom": "LIKE",
    "coinMinimalDenom": "nanolike",
    "coinDecimals": 9,
    "coinGeckoId": "likecoin"
  },
  "walletUrlForStaking": "https://stake.like.co",
  "bip44": {
    "coinType": 118
  },
  "bech32Config": {
    "bech32PrefixAccAddr": "like",
    "bech32PrefixAccPub": "likepub",
    "bech32PrefixValAddr": "likevaloper",
    "bech32PrefixValPub": "likevaloperpub",
    "bech32PrefixConsAddr": "likevalcons",
    "bech32PrefixConsPub": "likevalconspub"
  },
  "currencies": [
    {
      "coinDenom": "LIKE",
      "coinMinimalDenom": "nanolike",
      "coinDecimals": 9,
      "coinGeckoId": "likecoin"
    }
  ],
  "feeCurrencies": [
    {
      "coinDenom": "LIKE",
      "coinMinimalDenom": "nanolike",
      "coinDecimals": 9,
      "coinGeckoId": "likecoin",
      "gasPriceStep": {
        "low": 1,
        "average": 10,
        "high": 1000
      },
    }
  ],
  "coinType": 118,
  "features": ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"]
}

async function read_likecoin_address_from_keplr() {
  const { keplr } = window
  if (keplr == null) {
    // alert("You need to install Keplr")
    return
  }

  await keplr!.experimentalSuggestChain(likecoin_chaininfo)
  await keplr!.enable(likecoin_chaininfo.chainId)

  const offlineSigner = keplr!.getOfflineSigner(likecoin_chaininfo.chainId)
  const accounts = await offlineSigner.getAccounts()

  recent_writing_nfts_data_collector_address.value = accounts[0].address
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

</style>


<i18n lang="yaml">
en:
  meta:
    title: "LikeCoin Writing NFT Tools"

  Writing NFT Tools: Writing NFT Tools
  Recent Writing NFTs: Recent Writing NFTs

  Display at most: Display at most
  In last N days: In last N days
  NFT Creator: NFT Creator
  NFT Collector: NFT Collector
  Clear: Clear

  Only Show "Complete" NFTs: Only Show "Complete" NFTs
  Read NFTs Display Style: Read NFTs Display Style
  read_writing_nft_class_display_style:
    same_as_unread: Same as Unread
    collapsed: Collapsed
    hidden: Hidden

  Bookmarked Creators: Bookmarked Creators
  Blocked Creators: Blocked Creators
  Toggle: Toggle
  Only Show Their Created NFTs: Only Show Their Created NFTs

  Loading...: Loading...
  Refresh: Refresh

  Is There More～: Is There More～
  Before Time: Before {time}
  Loading More...: Loading More...
  Nothing left...: Nothing left...

zh:
  meta:
    title: "LikeCoin Writing NFT 工具"

  Writing NFT Tools: Writing NFT 工具
  Recent Writing NFTs: 最近的 Writing NFT

  Display at most: 顯示最多
  In last N days: 限最近多少日
  NFT Creator: NFT 創造者
  NFT Collector: NFT 收藏者
  Clear: 清除

  Only Show "Complete" NFTs: 只顯示"完整"的NFT
  Read NFTs Display Style: 已讀NFT顯示方式
  read_writing_nft_class_display_style:
    same_as_unread: 與未讀的相同
    collapsed: 縮小
    hidden: 隱藏

  Bookmarked Creators: NFT 創造者書籤清單
  Blocked Creators: NFT 創造者封鎖清單
  Toggle: 顯示/隱藏
  Only Show Their Created NFTs: 只顯示他們創造的NFT

  Loading...: 蕉蕉發電中…
  Refresh: 重新發電

  Is There More～: 還有更多嗎～
  Before Time: 在 {time} 以前
  Loading More...: 正在尋找更多…
  Nothing left...: 然後就沒有然後了…
</i18n>
