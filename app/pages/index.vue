<template>
  <div
    class="max-w-3xl max-w-5xlmin-h-screen flex justify-center mx-auto my-12"
  >
    <div class="w-full">
      <section>
        <h1 class="text-4xl font-bold mb-6 text-center">
          {{ t("PikaSer - Cosmos Blockchain Validator") }}
        </h1>
        <h2 class="text-1xl font-normal mb-6 text-center c-yellow-300">
          {{ t("Operated by PikachuEXE") }}
        </h2>
      </section>
      <section>
        <form class="flex flex-col space-y-2 mb-4">
          <label for="search-supported-networks" class>
            {{ t("Search Supported Networks") }}
          </label>
          <input
            id="search-supported-networks"
            v-model="query_text"
            class="px-3 py-2 shadow border border-gray-200"
            type="text"
            :placeholder="t('Search among N supported networks(s)', all_posts.length)"
          />
        </form>
      </section>
      <section class="divide-y">
        <article v-for="post of posts" :key="post.slug" class="pt-4 page-entry-box">
          <div class="page-entry-box__main-content">
            <h2 class="text-lg mb-2">
              <nuxt-link :to="post._path">
                {{ post.title }}
              </nuxt-link>
            </h2>
            <span>
              {{ post.description }}
            </span>
          </div>
          <div class="page-entry-box__image">
            <nuxt-img
              v-if="post.list_item_image_path"
              :src="post.list_item_image_path"
              loading="lazy"
            />
          </div>
        </article>
      </section>
    </div>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '#i18n'
import { useAsyncData, useHead } from "#imports"

const I18n = useI18n()
const { t } = I18n

const query_text = ref("")
const { data: all_posts } = await useAsyncData(`all-posts-${I18n.locale.value}`, () => {
  return queryNetworkHomepagesContent().find()
})
const { data: posts } = await useAsyncData(`all-posts-${I18n.locale.value}`, () => {
  return queryNetworkHomepagesContent().find()
})

watch(query_text, async (newQuery) => {
  if (!newQuery) {
    posts.value = await queryNetworkHomepagesContent().find()
    return
  }
  posts.value = await queryNetworkHomepagesContent().where({
    "title": { $contains: newQuery },
  }).find()
})

function queryNetworkHomepagesContent() {
  return queryContent(I18n.locale.value, "networks")
  .where({ page_type: { $contains: "network_homepage" } })
}


useHead({
  title: t("meta.title"),
})

</script>

<style lang="scss" scoped>
@use "sass:color";

a {
  color: yellow;

  // This state uses darker color
  // The rule must be put on top
  &:visited {
    color: color.adjust(orange, $lightness: 10%);
  }
  &:active ,
  &:hover {
    color: orange;
  }
}


.page-entry-box {
  display: flex;
  flex: 1;
  justify-content: center;

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
    title: Home

  "PikaSer - Cosmos Blockchain Validator": PikaSer - Cosmos Blockchain Validator
  "Operated by PikachuEXE": Operated by PikachuEXE
  "Search Supported Networks": Search Supported Networks
  "Search among N supported networks(s)": |-
    Search among {count} supported network(s)... But scrolling down might be faster

zh:
  meta:
    title: 首頁

  "PikaSer - Cosmos Blockchain Validator": PikaSer - Cosmos 區塊鏈驗證人
  "Operated by PikachuEXE": 由PikachuEXE運營
  "Search Supported Networks": 搜索PikaSer支援的網路
  "Search among N supported networks(s)": |-
    在 {count} 個受支援的網路中搜索... 但向下滾動看可能更快

</i18n>
