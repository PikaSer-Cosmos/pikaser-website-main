<template>
  <div>
    <header>
      <slot name="header">
        <TheHeader/>
      </slot>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>


<!--
Don't use `scoped` here, the style is meant to be global
-->
<style lang="scss">

a {
  transition-duration: .15s;
  transition-property: color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-text-decoration-color,-webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

</style>
