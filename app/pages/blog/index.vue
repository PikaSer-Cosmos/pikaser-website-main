<template>
  <div
      class="max-w-3xl max-w-5xlmin-h-screen flex justify-center mx-auto my-12"
  >
    <main class="w-full">
      <h1 class="text-2xl font-semibold mb-6">My awesome blog ({{ $i18n.locale }})</h1>
      <section>
        <form class="flex flex-col space-y-2 mb-4">
          <label for="search-blogs" class>Search blogs</label>
          <input
              id="search-blogs"
              v-model="query"
              class="px-3 py-2 shadow border border-gray-200"
              type="text"
          />
        </form>
      </section>
      <section class="space-y-4 divide-y">
        <article v-for="post of posts" :key="post.slug" class="pt-4">
          <h2 class="text-lg mb-2 text-blue-700 hover:text-blue-800">
            <nuxt-link :to="post._path">
              {{ post.title }}
            </nuxt-link>
          </h2>
          <span>
            {{ post.description }}
          </span>
        </article>
      </section>
    </main>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const I18n = useI18n()

const query = ref("")
const { data: posts } = await useAsyncData(`all-posts-${I18n.locale.value}`, () => {
  return queryContent(I18n.locale.value, "blog").find()
})

watch(query, async (newQuery) => {
  if (!newQuery) {
    posts.value = await queryContent(I18n.locale.value, "blog").find()
    return
  }
  posts.value = await queryContent(I18n.locale.value, "blog").where({
    "title": { $contains: newQuery },
  }).find()
})

</script>


