<template>
  <VanImage v-bind="attrs"></VanImage>
</template>

<script lang="ts" setup>
import { computed, PropType, toRefs } from 'vue'
import { parseInt } from 'lodash'
import { compressImage } from '@/utils/index'
import { ImageFit } from 'vant'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: ''
  },
  height: {
    type: [String, Number],
    default: ''
  },
  /* 是否裁剪 */
  tailor: {
    type: Boolean,
    default: false
  },
  /* 是否优化 */
  optimize: {
    type: Boolean,
    default: true
  },
  /* 默认将压缩图片放大2倍，防止太过模糊 */
  zoom: {
    type: Number,
    default: 2
  },
  fit: {
    type: String as PropType<ImageFit>,
    default: 'cover'
  }
})

const { src, width, height, tailor, optimize, zoom, fit } = toRefs(props)

const attrs = computed(() => {
  const _attrs = {
    src: src.value,
    width: width.value,
    height: height.value,
    fit: fit.value
  }
  if (src.value) {
    _attrs.src = optimize.value
      ? compressImage(
          src.value,
          width.value ? parseInt(`${width.value}`) * zoom.value : undefined,
          height.value ? parseInt(`${height.value}`) * zoom.value : undefined,
          tailor.value
        )
      : src.value
  }
  if (width.value) {
    _attrs.width = `${parseInt(`${width.value}`) / 37.5}rem`
  }
  if (height.value) {
    _attrs.height = `${parseInt(`${height.value}`) / 37.5}rem`
  }
  return _attrs
})
</script>
