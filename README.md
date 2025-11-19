# Dial Code Selector

一个基于Vue3的国家电话区号选择组件，允许用户选择国家对应的电话区号。

## 安装

```bash
npm install dial-code-selector flag-icons
```

## 使用

导入样式文件

```js
import 'dial-code-selector/dist/index.css';
import 'flag-icons/css/flag-icons.min.css';
```

在你的Vue3项目中，可以在任何Vue组件中使用 DialCodeSelector 组件：

```vue
<template>
  <dial-code-selector ref="dialCodeRef" clearable @select="handleSelect">
  <div v-if="selectedValue">
    <p>选择的国家代码: {{ selectedValue.alpha2 }}</p>
    <p>电话区号: {{ selectedValue.dialCode }}</p>
    <p>国家全称：{{ selectedValue.name }}</p>
  </div>
</dial-code-selector></template>

<script setup>
import { ref } from 'vue';
import DialCodeSelector from 'dial-code-selector';

const dialCodeRef = ref(null);
const selectedValue = ref(null);

const handleSelect = (value) => {
  selectedValue.value = value;
  console.log(value);
  if (dialCodeRef.value) {
    const info = dialCodeRef.value.getCurrentValue();
    console.log(info);
  }
};
</script>
```

## 搜索

支持三种关键词搜索：国家英文名称、国家代码、国家电话区号进行搜索

## 属性

| 属性名 | 类型 | 默认值 | 说明 | 是否必填 |
| --- | --- | --- | --- | --- |
| defaultValue | string |  | 默认选中国家的代码，使用国家代码如：cn, us | 否 |
| selectorClass | string |  | 选择器容器类名 | 否 |
| panelClass | string |  | 选择器面板类名 | 否 |
| placeholder | string | 'select' | placehlder | 否 |
| clearable | boolean | false | 是否显示清除按钮 | 否 |
| autoRecog | boolean | true | 是否自动识别国家区号(如果传入了defaultValue，自动识别将失效) | 否 |

## 事件

| 事件名 | 说明 | 回调参数 | 是否必填 |
| --- | --- | --- | --- |
| select | 当用户选择一个国家时触发。事件对象包含 alpha2 (国家代码)、dialCode (电话区号)、name(国家全称) | function(value: { alpha2: string; dialCode: string, name: string }) | 否 |

## 方法

| 方法名 | 说明 |
| --- | --- |
| getCurrentValue | 获取当前选择国家信息 |

## 插槽

| 插槽名 | 说明 | 是否必填 |
| --- | --- | --- |
| empty | 无匹配结果时显示的内容 | 否 |

## 依赖

- [flag-icons](https://github.com/lipis/flag-icons)
- [i18n-iso-countries](https://github.com/michaelwittig/node-i18n-iso-countries)
- [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js)
- [sass](https://github.com/sass/sass)
