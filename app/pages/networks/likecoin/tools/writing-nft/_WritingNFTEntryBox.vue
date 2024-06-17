<template>
  <article class="writing-nft-entry-box" v-if="entry_visible">
    <div
      v-observe-visibility="maybe_make_class_purchase_data_visible"
    ></div>
    <div
      v-observe-visibility="make_iscn_data_visible"
    ></div>
    <div class="writing-nft-entry-box__main-content">
      <h3 class="text-lg">
        <a :href="class_external_url" target="_blank" rel="noreferrer noopener">
          {{ entry_title_text }}
        </a>
      </h3>
      <section class="mt-4 vertical-middle space-x-1">
        <span>
          <NButton
            icon="carbon:document-tasks"
            n="purple xs"
            @click="writingNftReadClassIdList.addOneClassId(props.nft_class.id)"
            v-if="entry_is_unread"
          >
            {{ t("Mark NFT as Read") }}
          </NButton>
          <NButton
            icon="carbon:document-unknown"
            n="purple xs"
            @click="writingNftReadClassIdList.removeOneClassId(props.nft_class.id)"
            v-else
          >
            {{ t("Mark NFT as Unread") }}
          </NButton>
        </span>
        <span>
          <NButton
            icon="carbon:share"
            n="purple xs"
            @click="entry_sharing_panel_visible = false"
            v-if="entry_sharing_panel_visible"
          >
            {{ t("Hide Sharing Panel") }}
          </NButton>
          <NButton
            icon="carbon:share"
            n="purple xs"
            @click="entry_sharing_panel_visible = true"
            v-else
          >
            {{ t("Show Sharing Panel") }}
          </NButton>
        </span>
        <span>
          <NButton
            icon="carbon:money"
            n="purple xs"
            @click="entry_likecoin_iframe_visible = false"
            v-if="entry_likecoin_iframe_visible"
          >
            {{ t("Hide NFT Widget") }}
          </NButton>
          <NButton
            icon="carbon:money"
            n="purple xs"
            @click="entry_likecoin_iframe_visible = true"
            v-else
          >
            {{ t("Show NFT Widget") }}
          </NButton>
        </span>
      </section>
      <section
        v-if="entry_sharing_panel_visible"
        class="mt-4"
      >
        <section>
          <textarea
            v-element-in-view="resizeTextarea"
            class="w-full p-2"
            ref="sharingTextarea"
            readonly
            :value="entry_sharing_panel_text"
          />
        </section>
        <section class="mt-2">
          <NButton
            icon="carbon:copy"
            n="green xs"
            @click="copyTextArea"
          >
            {{ t("Copy to Clipboard") }}
          </NButton>
        </section>
      </section>
      <section
        v-if="entry_likecoin_iframe_visible"
        class="mt-4"
      >
        <iframe
          width="360"
          height="480"
          :src="entry_likecoin_iframe_src"
        />
      </section>
      <section
        v-if="entry_displayed_as_expanded"
      >
        <section class="mt-4">
          <a :href="entry_liker_url" target="_blank" rel="noreferrer noopener">
            {{ t("NFT Page on Liker Land") }}
          </a>
          <span> - </span>
          <span>{{ dayjs(props.nft_class.created_at).format("YYYY-MM-DD HH:mm:ss") }}</span>
          <span> - </span>
          <a :href="`https://app.like.co/view/${encodeURIComponent(props.nft_class.parent.iscn_id_prefix)}`" target="_blank" rel="noreferrer noopener">
            {{ t("On-Chain Data") }}
          </a>
        </section>
        <section v-if="class_is_book" class="mt-4">
          {{ t("NFT Book") }} ({{ props.nft_class.metadata?.nft_meta_collection_name }})
        </section>
        <section
          v-if="class_purchase_data_visible"
          class="mt-4"
        >
          <span>
            {{ t("Current Price") }}
            <span>: </span>
            <span v-if="class_purchase_data_loading">...</span>
            <strong v-else-if="class_purchase_data_error != null">???</strong>
            <strong v-else-if="class_purchase_data.price < 0">{{ t("Sold Out") }}</strong>
            <strong v-else>{{ class_purchase_data.price }} USD</strong>
          </span>
            <span> - </span>
            <span>
            {{ t("Sold") }}
            <span>: </span>
            <span v-if="class_purchase_data_loading">...</span>
            <strong v-else-if="class_purchase_data_error != null">???</strong>
            <strong v-else>{{ class_purchase_data.metadata.soldCount }}</strong>
          </span>
        </section>
        <section
          v-if="iscn_data_visible"
          class="mt-4"
        >
          <p>
            {{ t("ISCN Owner") }}
            <span> - </span>
            <span v-if="class_metadata_loading">...</span>
            <strong v-else-if="class_metadata_error != null">???</strong>
            <span v-else>
            <a :href="`https://liker.land/${class_metadata.iscn_owner}`" target="_blank" rel="noreferrer noopener">
              <strong>{{ class_metadata.iscn_owner }}</strong>
              <span
                v-observe-visibility="make_iscn_owner_data_visible"
              ></span>
              <span v-if="iscn_owner_data_visible && !iscn_owner_data_loading && iscn_owner_data != null">
                ({{ iscn_owner_data.displayName }})
              </span>
            </a>
          </span>
          </p>
          <section
            v-if="iscn_owner_ready"
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
        <section class="mt-4 break-all">
          {{ props.nft_class.description }}
        </section>
        <section class="mt-4" v-if="class_metadata_image_valid">
          <img :src="class_metadata_image_url_sometimes_converted" loading="lazy" />
        </section>
      </section>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from '#i18n'
import { useLazyAsyncData } from "#imports"
import dayjs from 'dayjs'
import { useToast } from 'vue-toast-notification'
import _once from "lodash.once"
import 'vue-toast-notification/dist/theme-sugar.css'

import { useWritingNftReadClassIdList } from "./composables/writing_nft_read_class_list"
import {
  useWritingNftOptionsStore,
  ReadWritingNftClassDisplayStyle,
} from "./composables/writing_nft_options"


interface ClassMetadata {
  iscn_owner: string
}


const writingNftReadClassIdList = useWritingNftReadClassIdList()
const writingNftOptionsStore = useWritingNftOptionsStore()

const I18n = useI18n()
const { t } = I18n

const $toast = useToast()

const emit = defineEmits<{
  (e: 'filter_by_creator_address', address: string): void

  (e: 'bookmark_creator_address', address: string): void
  (e: 'unbookmark_creator_address', address: string): void

  (e: 'block_creator_address', address: string): void

  (e: 'mark_nft_class_as_read', nft_class_id: string): void
  (e: 'mark_nft_class_as_unread', nft_class_id: string): void

  (e: 'hide_for_blocked_creator_address', nft_class_id: string): void
  (e: 'show_for_blocked_creator_address', nft_class_id: string): void
}>()

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


const class_is_book = props.nft_class.metadata?.nft_meta_collection_id?.includes("book")
const class_purchase_data_should_be_visible = !class_is_book
const class_purchase_data_visible = ref(false)
function maybe_make_class_purchase_data_visible(isVisible) {
  // Don't care when it's hidden
  if (!isVisible) { return }
  // No change needed
  if (!class_purchase_data_should_be_visible) { return }
  // Already visible
  if (class_purchase_data_visible.value) { return }

  class_purchase_data_visible.value = true
  refresh_class_purchase_data_when_visible()
}
const {
  pending: class_purchase_data_loading,
  data: class_purchase_data,
  error: class_purchase_data_error,
  refresh: refresh_class_purchase_data,
} = useLazyAsyncData(
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
  }),
  {
    immediate: false,
  },
)
function refresh_class_purchase_data_when_visible() {
  // If loaded = don't reload
  if (!class_purchase_data_loading.value) { return }

  refresh_class_purchase_data()
}
const class_purchase_data_valid = computed<boolean>(() => !class_purchase_data_loading.value && class_purchase_data_error.value == null)

const iscn_data_visible = ref(false)
function make_iscn_data_visible(isVisible) {
  // Don't care when it's hidden
  if (!isVisible) { return }
  // Already visible
  if (iscn_data_visible.value) { return }

  iscn_data_visible.value = true
  refresh_class_metadata()
}


const get_fetch_class_metadata_promise = _once(() => $fetch<ClassMetadata>(
  "https://api.like.co/likernft/metadata",
  {
    params: {
      iscn_id: props.nft_class.parent.iscn_id_prefix,
    },
  }
))

const {
  pending:  class_metadata_loading,
  data:     class_metadata,
  error:    class_metadata_error,
  refresh:  refresh_class_metadata,
} = useLazyAsyncData(
  [
    "class_metadata",
    props.nft_class.parent.iscn_id_prefix,
  ].join("/"),
  (() => {
    return new Promise((resolve) => {
      if (props.nft_class.iscn?.owner != null && props.nft_class.metadata?.image != null) {
        resolve({
          // Only from Pikaser Indexer
          iscn_owner: props.nft_class.iscn?.owner,
          image:      props.nft_class.metadata?.image,
        })
        return
      }

      // https://docs.like.co/developer/likenft/api-reference
      resolve(get_fetch_class_metadata_promise())
    })
  }),
  {
    immediate: false,
  },
)
const class_metadata_valid = computed<boolean>(() => {
  return !class_metadata_loading.value && class_metadata_error.value == null
})
const iscn_owner_ready = computed<boolean>(() => {
  if (props.nft_class.iscn?.owner != null) { return true }

  return class_metadata_valid.value
})
const iscn_owner_value = computed<boolean>(() => {
  if (props.nft_class.iscn?.owner != null) { return props.nft_class.iscn?.owner }

  return class_metadata.value.iscn_owner
})
const class_metadata_image_url_sometimes_converted = computed<String|null>(() => {
  const image_url_from_nft_class_metadata = props.nft_class.metadata.image
  let image_url = null
  if (image_url_from_nft_class_metadata != null && image_url_from_nft_class_metadata !== "") {
    image_url = image_url_from_nft_class_metadata
  }
  else if (class_metadata_valid.value) {
    image_url = class_metadata.value.image
  }
  if (image_url == null) { return null }

  // HTTP(s) = just use directly
  if (image_url.startsWith('http')) { return image_url }
  // Arweave = convert into HTTP
  if (image_url.startsWith('ar://')) {
    return image_url.replace('ar://', 'https://arweave.net/')
  }

  // Cannot handle
  return null
})
const class_metadata_image_valid = computed<boolean>(() => {
  return class_metadata_image_url_sometimes_converted.value != null
})


const creator_bookmarked = computed<boolean>(() => {
  if (iscn_owner_ready.value) {
    return props.all_bookmarked_creator_addresses.has(iscn_owner_value.value)
  }

  return false
})

const creator_blocked = computed<boolean>(() => {
  if (iscn_owner_ready.value) {
    return props.all_blocked_creator_addresses.has(iscn_owner_value.value)
  }

  return false
})


const iscn_owner_data_visible = ref(false)
function make_iscn_owner_data_visible(isVisible) {
  // Don't care when it's hidden
  if (!isVisible) { return }
  // Already visible
  if (iscn_owner_data_visible.value) { return }

  iscn_owner_data_visible.value = true
  refresh_iscn_owner_data()
}
const {
  pending:  iscn_owner_data_loading,
  data:     iscn_owner_data,
  error:    iscn_owner_data_error,
  refresh:  refresh_iscn_owner_data,
} = useLazyAsyncData(
  [
    "iscn_owner_data",
    props.nft_class.parent.iscn_id_prefix,
  ].join("/"),
  (() => {
    return new Promise((resolve) => {
      if (iscn_owner_ready.value && class_metadata.value != null) {
        resolve(class_metadata.value)
        return
      }

      resolve(get_fetch_class_metadata_promise())
    })
    .then((class_metadata_2) => {
      return $fetch(
        `https://api.like.co/users/addr/${class_metadata_2.iscn_owner}/min`,
      )
    })
  }),
  {
    immediate: false,
  },
)


const entry_is_unread = computed<boolean>(() => {
  return !writingNftReadClassIdList.has_id(props.nft_class.id)
})
const entry_is_read = computed<boolean>(() => {
  return !entry_is_unread.value
})

const entry_displayed_as_expanded = computed<boolean>(() => {
  if (writingNftOptionsStore.read_writing_nft_class_display_style !== ReadWritingNftClassDisplayStyle.COLLAPSED) {
    return true
  }

  return entry_is_unread.value
})

const entry_title_text = computed<string>(() => props.nft_class.metadata.name || props.nft_class.name.replace("Writing NFT - ", ""))
const entry_liker_url = computed<string>(() => `https://liker.land/nft/class/${props.nft_class.id}`)

const entry_visible = computed<boolean>(() => {
  if (writingNftOptionsStore.read_writing_nft_class_display_style === ReadWritingNftClassDisplayStyle.HIDDEN && entry_is_read.value) {
    return false
  }

  if (props.only_writing_nft_with_complete_data_visible_input && ( !class_purchase_data_valid.value || !class_metadata_valid.value )) {
    return false
  }

  if (creator_blocked.value) {
    emit('hide_for_blocked_creator_address', props.nft_class.id)
    return false
  }
  else {
    emit('show_for_blocked_creator_address', props.nft_class.id)
  }

  if (props.only_writing_nft_from_bookmarked_creator_visible) {
    return creator_bookmarked.value
  }

  return true
})

const entry_sharing_panel_visible = ref<boolean>(false)
const entry_sharing_panel_text = computed<string>(() => {
  return `
#like #likecoin #WritingNFT

${entry_title_text.value}

${props.nft_class.description}

${entry_liker_url.value}
  `.trim()
})

const sharingTextarea = ref(null)
function resizeTextarea() {
  const area = sharingTextarea.value
  area.style.overflow = 'hidden'
  area.style.height = area.scrollHeight + 'px'
}
async function copyTextArea() {
  const area = sharingTextarea.value
  const textToCopy = area.value

  const clipBoard = navigator.clipboard
  await clipBoard.writeText(textToCopy)

  $toast.success(t("Copied To Clipboard"), {
    position: 'top',
    duration: 3000,
  })
}

// https://docs.like.co/general-guides/writing-nft/collect-writing-nft/nft-widget
// No actual doc about the URL though
const entry_likecoin_iframe_visible = ref<boolean>(false)
const entry_likecoin_iframe_src = computed<string>(() => {
  return `https://button.like.co/in/embed/nft?class_id=${props.nft_class.id}`
})

const class_external_url = computed<string>(() => {
  const external_url_from_metadata = props.nft_class.metadata.external_url
  if (typeof external_url_from_metadata === 'string' && external_url_from_metadata.startsWith('http')) {
    return external_url_from_metadata
  }

  return `https://liker.land/nft/class/${props.nft_class.id}`
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
  NFT Book: NFT Book
  Current Price: Current Price
  Sold Out: Sold Out
  Sold: Sold
  ISCN Owner: ISCN Owner

  Mark NFT as Read: Mark NFT as Read
  Mark NFT as Unread: Mark NFT as Unread

  Show Sharing Panel: Show Sharing Panel
  Hide Sharing Panel: Hide Sharing Panel
  Copy to Clipboard: Copy to Clipboard
  Copied To Clipboard: Copied To Clipboard

  Show NFT Widget: Show NFT Widget
  Hide NFT Widget: Hide NFT Widget

  View NFTs by This Creator: View NFTs by This Creator
  Bookmark This Creator: Bookmark This Creator
  Unbookmark This Creator: Unbookmark This Creator
  Block This Creator: Block This Creator

zh:
  NFT Page on Liker Land: Liker Land上的NFT頁面
  On-Chain Data: LikeCoin鏈上資料
  NFT Book: NFT 書
  Current Price: 現時價格
  Sold Out: 售馨
  Sold: 已賣出
  ISCN Owner: ISCN 擁有者

  Show Sharing Panel: 顯示分享面板
  Hide Sharing Panel: 隱藏分享面板
  Copy to Clipboard: 複製到剪貼板
  Copied To Clipboard: 已複製到剪貼板

  Show NFT Widget: 顯示 NFT Widget
  Hide NFT Widget: 隱藏 NFT Widget

  Mark NFT as Read: 將此NFT標記為已讀
  Mark NFT as Unread: 將此NFT標記為未讀

  View NFTs by This Creator: 只看此創造者的NFT
  Bookmark This Creator: 將此創造者加入書籤清單
  Unbookmark This Creator: 將此創造者踢出書籤清單
  Block This Creator: 將此創造者加入封鎖清單
</i18n>
