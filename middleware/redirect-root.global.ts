// No page can be created to handle root `/`, so using a middleware
//
// Refs:
// https://v3.nuxtjs.org/guide/directory-structure/middleware
// https://github.com/nuxt-community/i18n-module/blob/v7.2.3/src/templates/plugin.main.js#L267-L283

export default defineNuxtRouteMiddleware((to, _from) => {
  if (to.path === "/") {
    return navigateTo(
      "/zh",
      {
        redirectCode: 302,
      },
    )
  }
})
