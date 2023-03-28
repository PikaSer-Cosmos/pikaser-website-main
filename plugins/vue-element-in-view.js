import elementInView from "@lamsal-de/vue-element-in-view"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    elementInView,
    {
      /* your fallback threshold */
      threshold: 0,
      /* set to true if used in SSR mode*/
      ssr: false
    }
  )
})
