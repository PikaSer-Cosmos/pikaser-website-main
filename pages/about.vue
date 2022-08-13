<template>
  <div
    class="max-w-3xl max-w-5xlmin-h-screen flex justify-center mx-auto my-12"
  >
    <div class="w-full">
      <section class="space-y-6">
        <h1 class="text-4xl font-bold text-center">
          {{ t("About PikaSer") }}
        </h1>
        <h2 class="text-1xl font-normal text-center">
          {{ t("Cosmos Blockchain Validator operated by PikachuEXE") }}
        </h2>
        <h3 class="text-1xl font-normal text-center">
          <span class=c-yellow-300>PikachuEXE</span> =
          <nuxt-link to="https://pokemon.fandom.com/wiki/Pikachu">Pikachu</nuxt-link> + <nuxt-link to="https://www.capcom-games.com/megaman/exe/en-us/">RockmanEXE</nuxt-link>
        </h3>
      </section>
      <hr class="my-12"/>
      <section class="space-y-6">
        <h2 class="text-2xl font-bold mb-6">
          {{ t("Contacts") }}
        </h2>
        <div>
          <h3 class="text-1xl font-normal mb-4">
            {{ t("English") }}
          </h3>
          <ul class="space-y-4 list-inside list-disc">
            <li>
              <nuxt-link to="https://twitter.com/PikachuEXE2021">Twitter (@PikachuEXE2021)</nuxt-link>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-1xl font-normal mb-4">
            {{ t("Chinese") }}
          </h3>
          <ul class="space-y-4 list-inside list-disc">
            <li>
              <nuxt-link to="https://liker.social/web/@PikachuEXE">Liker Social (@PikachuEXE)</nuxt-link>
            </li>
            <li>
              <nuxt-link to="https://matters.news/@pikachuexech">Matters (@pikachuexech)</nuxt-link>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-1xl font-normal mb-4">
            {{ t("Coding") }}
          </h3>
          <ul class="space-y-4 list-inside list-disc">
            <li>
              <nuxt-link to="https://github.com/PikaSer-Cosmos">GitHub (PikaSer-Cosmos)</nuxt-link>
            </li>
            <li>
              <nuxt-link to="https://github.com/PikachuEXE">GitHub (PikachuEXE)</nuxt-link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>


<script setup>
import { useI18n } from '#i18n'

const { t } = useI18n()

useHead({
  title: t("meta.title"),
})

</script>

<style lang="scss" scoped>

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
    title: About

  "About PikaSer": About PikaSer
  "Cosmos Blockchain Validator operated by PikachuEXE": Cosmos Blockchain Validator operated by PikachuEXE

  "Contacts": Contacts
  "English": English
  "Chinese": Chinese

  "Coding": Coding

zh:
  meta:
    title: 簡介

  "About PikaSer": 關於PikaSer
  "Cosmos Blockchain Validator operated by PikachuEXE": 由PikachuEXE運營的Cosmos區塊鏈驗證人

  "Contacts": 聯絡/通訊
  "English": 英文
  "Chinese": 中文

  "Coding": 代碼/開發

</i18n>
