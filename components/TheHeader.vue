<template>
  <nav class="topnav">
    <div class="nav-item-lists max-w-3xl mx-auto">
      <ul class="nav-item-list nav-item-list-left">
        <li>
          <nuxt-link
            :to="localePath('/')"
            class="logo-link"
          >
            <nuxt-img
              class="logo"
              src="/logos/pikachu-sir-stripped.jpg"
              alt="Logo"
              height="195"
              width="195"
              preload
            />
          </nuxt-link>
        </li>
        <li>
          <nuxt-link
            :to="localePath('/')"
          >
            {{ t("Home") }}
          </nuxt-link>
        </li>
        <li v-if="false">
          <nuxt-link
            :to="localePath('blog')"
          >
            {{ t("Blog") }}
          </nuxt-link>
        </li>
      </ul>
      <ul class="nav-item-list nav-item-list-right">
        <li
          v-for="locale in $i18n.locales"
          :key="locale.code"
        >
          <nuxt-link
            :to="switchLocalePath(locale.code)"
          >
            {{ locale.name }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from "#i18n"

const { t } = useI18n()
</script>

<style scoped lang="scss">
$navbar-height: 60px;

/* Reset style */
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

/* Add a black background color to the top navigation */
.topnav {
  height: $navbar-height;

  background-color: #333;
  overflow: hidden;
}

.nav-item-lists {
  height: 100%;

  display: flex;
  flex: 1;
}

.nav-item-list {
  height: 100%;

  display: flex;
}

.nav-item-list-right {
  margin-left: auto;
}

  /* Style the links inside the navigation bar */
.nav-item-list > * > a {
  display: inline-block;
  padding: 0 16px;
  height: 100%;

  color: #f2f2f2;
  font-size: 17px;
  line-height: $navbar-height;
  text-align: center;
  text-decoration: none;

  /* Change the color of links on hover */
  &:hover {
    background-color: #ddd;
    color: black;
  }
  /* Add a color to the active/current link */
  &:active {
    background-color: #04AA6D;
    color: white;
  }
  &.logo-link {
    padding-left: 0;
    background-color: transparent;
  }
}

.logo-link {
  max-height: 100%;
}
.logo {
  // Circle
  border-radius: 50%;

  max-height: 100%;
  width: auto;
}

</style>

<i18n lang="yaml">

en:
  Home: Home
  Blog: Blog

zh:
  Home: 首頁
  Blog: 博客

</i18n>

