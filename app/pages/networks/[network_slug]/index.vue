<template>
  <template v-if="data">
    <div
      class="max-w-3xl max-w-5xlmin-h-screen flex justify-center mx-auto my-12"
    >
      <article class="w-full">
        <h1 class="text-2xl font-semibold mb-6">{{ data.title }}</h1>

        <div v-if="all_service_n_tools_entries_loaded && (all_service_posts.length + all_tool_pages.length) > 0">
          <hr class="my-8"/>
          <section>
            <h2 class="text-2xl font-600 mb-2">
              {{ t("Community Tools & Services") }}
            </h2>
            <div class="divide-y">
              <article v-for="post of all_service_posts" :key="post.slug" class="page-entry-box">
                <div class="page-entry-box__main-content">
                  <h3 class="text-lg mb-2">
                    <nuxt-link :to="post.path">
                      {{ post.title }}
                    </nuxt-link>
                  </h3>
                  <span>
                    {{ post.description }}
                  </span>
                </div>
              </article>
              <article v-for="post of all_tool_pages" :key="post.slug" class="page-entry-box">
                <div class="page-entry-box__main-content">
                  <h3 class="text-lg mb-2">
                    <nuxt-link :to="post.path">
                      {{ post.title }}
                    </nuxt-link>
                  </h3>
                  <span>
                    {{ post.description }}
                  </span>
                </div>
              </article>
            </div>
          </section>
        </div>

        <section class="markdown-body">
          <ContentRenderer :value="data" />
        </section>

        <div v-if="!all_proposal_posts_loading && all_proposal_posts.length > 0">
          <hr class="my-8" />
          <section>
            <h2 class="text-2xl font-600 mb-2">
              {{ t("Past Proposal Decisions") }}
            </h2>
            <div class="divide-y">
              <article v-for="post of all_proposal_posts" :key="post.slug" class="page-entry-box">
                <div class="page-entry-box__main-content">
                  <h3 class="text-lg mb-2">
                    <nuxt-link :to="post.path">
                      {{ post.title }}
                    </nuxt-link>
                  </h3>
                  <span>
                {{ post.description }}
              </span>
                </div>
              </article>
            </div>
          </section>
        </div>
      </article>
    </div>
  </template>

  <template v-if="!data">
    <h1>Document not found</h1>
  </template>
</template>

<script setup>
import { useI18n } from '#i18n'
import { useAsyncData } from "#imports"
import { computed } from "vue"

const I18n = useI18n()
const { t } = useI18n()
const route = useRoute()


const { data } = await useAsyncData(
  [
    I18n.locale.value,
    route.params.network_slug,
  ].join("/"),
  () => queryCollection('content')
  .where('path', 'LIKE', `/${I18n.locale.value}/networks/${route.params.network_slug}%`)
  .where('page_type', '=', "network_homepage")
  .first()
)

useSeoMeta({
  title: data.value?.title,
  description: data.value?.description
})


const {
  pending: all_proposal_posts_loading,
  data: all_proposal_posts,
} = useLazyAsyncData(
  [
    "all_proposal_posts",
    I18n.locale.value,
    route.params.network_slug,
  ].join("/"),
  () => {
    return queryNetworkProposalsContent()
    .order('title', 'DESC')
    .all()
  }
)

function queryNetworkProposalsContent() {
  return queryCollection('content')
  .where('path', 'LIKE', `/${I18n.locale.value}/networks/${route.params.network_slug}/proposals%`)
}

const {
  pending: all_service_posts_loading,
  data: all_service_posts,
} = useLazyAsyncData(
  [
    "all_service_posts",
    I18n.locale.value,
    route.params.network_slug,
  ].join("/"),
  () => {
    return queryNetworkServicesContent()
    .all()
  }
)

function queryNetworkServicesContent() {
  return queryCollection('content')
  .where('path', 'LIKE', `/${I18n.locale.value}/networks/${route.params.network_slug}/services%`)
}

const {
  pending: all_tool_pages_loading,
  data: all_tool_pages,
} = useLazyAsyncData(
  [
    "all_tool_pages",
    I18n.locale.value,
    route.params.network_slug,
  ].join("/"),
  () => {
    return queryNetworkToolPagesContent()
    .all()
  }
)

function queryNetworkToolPagesContent() {
  return queryCollection('content')
  .where('path', 'LIKE', `/${I18n.locale.value}/networks/${route.params.network_slug}/tools%`)
}

const all_service_n_tools_entries_loaded = computed(() => {
  return !all_service_posts_loading.value && !all_tool_pages_loading.value
})

</script>

<style lang="scss">
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

.markdown-body {
  background-color: transparent;

  a {
    // This is needed to override default style for `markdown-body`
    @extend a;
  }

  h1, h2 {
    border-bottom-color: rgba(110,118,129,0.4);
  }

  h1, h2, h3, h4, h5, h6 {
    a {
      color: inherit;

      &:hover {
        text-decoration: none;
      }

      // Reset color
      &:visited {
        color: inherit;
      }
      &:active ,
      &:hover {
        color: inherit;
      }
    }
  }

  ol, ul {
    list-style: disc outside;
  }

  p:last-child {
    // Fix weird spacing
    margin-bottom: 0;
  }
}

.page-entry-box {
  // Using padding on top to ensure spacing
  padding-top: 1rem;
  // Using margin bottom to avoid uneven spacing
  margin-bottom: 1rem;

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
  Past Proposal Decisions: Past Proposal Decisions
  Community Tools & Services: Community Tools & Services

zh:
  Past Proposal Decisions: 過去議案決定
  Community Tools & Services: 各種工具和服務
</i18n>
