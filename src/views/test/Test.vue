<template>
  <div>test</div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()

console.log(route.query.q1)
</script>
