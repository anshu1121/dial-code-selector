<script setup lang="ts">
import { ref } from 'vue'
import DialCodeSelector from './components/DialCodeSelector.vue'

const value = ref()
const dialCodeRef = ref()

const handleSelect = (v: any) => {
  value.value = v
  
  if (dialCodeRef.value) {
    const country = dialCodeRef.value?.getCurrentValue()
    console.log(country);
  }
}
</script>

<template>
  <div class="demo">
    <DialCodeSelector ref="dialCodeRef" clearable @select="handleSelect">
      <!-- <template #option="{ item }">
        <span :class="['fi', `fi-${item.alpha2}`]" />
        <p>{{ item.name }}</p>
        <p>{{ item.dialCode }}</p>
      </template>
      <template #empty>
        <div>empty</div>
      </template> -->
    </DialCodeSelector>
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
