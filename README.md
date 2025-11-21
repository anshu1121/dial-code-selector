# Dial Code Selector

一个基于Vue3的国家电话区号选择组件。

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

## 示例

```html
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

  // 非必须定义Ref，只有当启用自动识别且没有手动选择时才需要
  if (dialCodeRef.value) {
    const info = dialCodeRef.value.getCurrentValue();
    console.log(info);
  }
};
</script>
```

## 支持搜索

支持三种关键词搜索：国家英文名称、国家代码、国家电话区号

## 属性

| 属性名 | 类型 | 默认值 | 说明 | 是否必填 |
| --- | --- | --- | --- | --- |
| defaultValue | string |  | 默认选中国家的代码，使用国家代码如：cn, us | 否 |
| selectorClass | string |  | 选择器容器类名 | 否 |
| panelClass | string |  | 选择器面板类名 | 否 |
| placeholder | string | "select" | placeholder | 否 |
| clearable | boolean | false | 是否显示清除按钮 | 否 |
| autoRecog | boolean | true | 是否自动识别国家区号(如果传入了defaultValue，自动识别将失效) | 否 |

## 事件

| 事件名 | 说明 | 回调参数 | 是否必填 |
| --- | --- | --- | --- |
| select | 当用户选择一个国家时触发。事件对象包含 alpha2 (国家代码)、dialCode (电话区号)、name(国家全称) | function({ alpha2: string; dialCode: string, name: string }) | 否 |

## 方法

| 方法名 | 说明 |
| --- | --- |
| getCurrentValue | 获取当前已选择的国家的信息 |

## 插槽

| 插槽名 | 说明 | 参数 | 是否必填 |
| --- | --- | --- | --- |
| option | 自定义列表项 | { item, isSelected, pick } | 否 |
| empty | 无匹配结果时显示的内容 | 无 | 否 |

### 插槽参数

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| item | { alpha2: string; name: string; dialCode: string } | 列表项数据 |
| isSelected | boolean | 当前项是否选中 |
| pick | function | 选中当前项的回调函数 |

## 国旗图标说明

- 国旗图标的渲染使用了flag-icons图标库，确保在项目中正确引入flag-icons的CSS文件。
- 如果使用列表项插槽并且需要显示国旗，则需要为元素添加fi类名，并使用flag-icons提供的字体图标,如:

```html
<span :class="['fi', 'fi-'+item.alpha2]" />
```

## 依赖

- [flag-icons](https://github.com/lipis/flag-icons)
- [i18n-iso-countries](https://github.com/michaelwittig/node-i18n-iso-countries)
- [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js)
- [sass](https://github.com/sass/sass)
