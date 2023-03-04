<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="mainStore.keepAliveRoutes">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts" setup>
import { useMainStore } from '@/store/index'

const mainStore = useMainStore()
</script>

<style lang="scss">
.pf-medium {
  font-weight: bold;
}

.pf-simbold {
  font-weight: bold;
}

.y-e-ios {
  .pf-medium {
    font-weight: 500;
  }

  .pf-simbold {
    font-weight: 600;
  }
}
</style>
