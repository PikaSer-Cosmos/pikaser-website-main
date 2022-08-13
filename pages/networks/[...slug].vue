<template>
  <template v-if="data">
    <div
      class="max-w-3xl max-w-5xlmin-h-screen flex justify-center mx-auto my-12"
    >
      <article class="w-full">
        <h1 class="text-2xl font-semibold mb-6">{{ data.title }}</h1>
        <section class="markdown-body">
          <ContentRenderer :value="data" />
<!--          <ContentRendererMarkdown2 :value="data" />-->
        </section>
      </article>
    </div>
  </template>

  <template v-if="!data">
    <h1>Document not found</h1>
  </template>
</template>

<script setup>
const route = useRoute()

const { data } = await useAsyncData(() => queryContent(route.path).findOne())

useContentHead(data)
</script>

<style lang="scss">

.markdown-body {
  background-color: transparent;

  a {
    color: yellow;

    // This state uses darker color
    // The rule must be put on top
    &:visited {
      color: darken(orange, 10%);
    }
    &:active ,
    &:hover {
      color: orange;
    }
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
}

</style>
