<script setup lang="ts">
import { ref } from 'vue'
import DialCodeSelector from './components/DialCodeSelector.vue'

const value = ref()

const handleSelect = (v: any) => {
  value.value = v
}
</script>

<template>
  <div class="demo">
    <DialCodeSelector clearable @select="handleSelect" />
    <div class="preview">
      <span v-if="value" class="fi" :class="'fi-' + value.alpha2" />
      <span v-if="value" class="dial">{{ value.dialCode }}</span>
      <span v-if="value" class="name">{{ value.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.demo { display: flex; flex-direction: column; gap: 12px; padding: 24px }
.preview { display: flex; align-items: center; gap: 10px }
.dial { font-weight: 600 }
</style>
