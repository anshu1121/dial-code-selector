# Country Dial Code Selector 组件

一个基于Vue 3的电话区号选择组件，允许用户选择国家对应的电话区号。

## 安装

```bash
npm install dial-code-selector
```

## 使用

在你的Vue 3项目中，可以在任何Vue组件中使用 DialCodeSelector 组件：

```vue
<template>
  <dial-code-selector @select="handleSelect">
  <div v-if="selectedValue">
    选择的国家代码: {{ selectedValue.alpha2 }}，电话区号: {{ selectedValue.dialCode }}
  </div>
</dial-code-selector></template>

<script setup>
import { ref } from 'vue';
import DialCodeSelector from 'dial-code-selector';

const selectedValue = ref(null);

const handleSelect = (value) => {
  selectedValue.value = value;
  console.log(value);
};
</script>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| defaultValue | string |  | 默认选中国家，使用国家缩写如：cn, en |
| selectorClass | string |  | 选择器容器类名 |
| panelClass | string |  | 选择器面板类名 |
| placeholder | string | 'select country' | placehlder |
| clearable | boolean | false | 是否显示清除按钮 |

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 当用户选择一个国家时触发。事件对象包含 alpha2 (国家代码)、dialCode (电话区号)、name(国家名称) | function(value: { alpha2: string; dialCode: string, name: string }) |

## 依赖

- [flag-icons](https://github.com/lipis/flag-icons)
- [i18n-iso-countries](https://github.com/michaelwittig/node-i18n-iso-countries)
- [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js)
- [sass](https://github.com/sass/sass)
