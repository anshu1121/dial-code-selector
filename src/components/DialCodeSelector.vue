<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { getCountryCallingCode } from "libphonenumber-js";
import type { SelectedValue, DialCodeSelectorProps } from '../../index'

type CountryOption = {
    alpha2: string; // 国家代码
    name: string; // 国家全称
    dialCode: string; // 电话区号
};

const DialCodeSelectorProps = withDefaults(defineProps<DialCodeSelectorProps>(), {
    placeholder: "select",
    autoRecog: true,
});
const emit = defineEmits<{
    (e: "select", v: SelectedValue | null): void;
}>();

const options = ref<CountryOption[]>([]);
const search = ref("");
const open = ref(false);
const selected = ref<SelectedValue | null>(null);
const panelScrollTop = ref(0);

// 生成国家选项列表
const generateCountryOptions = () => {
    countries.registerLocale(en);
    const names = countries.getNames("en", { select: "alias" });
    const arr: CountryOption[] = [];

    Object.entries(names).forEach(([code, name]) => {
        try {
            const dialCode = "+" + String(getCountryCallingCode(code as any));
            const alpha2 = code.toLowerCase();
            arr.push({ alpha2, name, dialCode });
        } catch {}
    });

    arr.sort((a, b) => a.name.localeCompare(b.name));
    options.value = arr;
};

// 应用默认选择
function applyInitialSelection() {
    if (!DialCodeSelectorProps.defaultValue) return;

    const alpha2 = DialCodeSelectorProps.defaultValue.toLowerCase();
    const found = options.value.find((o) => o.alpha2 === alpha2);
    if (found) {
        selected.value = found;
    }
}

// 过滤选项
const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return options.value;

    // 判断输入的是数字还是字母
    const isNumeric = /^\d+$/.test(q.replace("+", ""));

    // 精确匹配 dialCode, alpha2, name
    const exactMatches = options.value.filter((o) =>
        isNumeric
            ? o.dialCode.toLowerCase() === q
            : o.alpha2 === q || o.name.toLowerCase() === q
    );

    // 模糊匹配 dialCode, alpha2, name，排除精确匹配的结果
    const fuzzyMatches = options.value
        .filter((o) =>
            isNumeric
                ? o.dialCode.toLowerCase().includes(q)
                : o.name.toLowerCase().includes(q) || o.alpha2.includes(q)
        )
        .filter((o) => !exactMatches.includes(o));

    // 对模糊匹配的结果进行排序，确保搜索的字母在前面的国家排在前面
    fuzzyMatches.sort((a, b) => {
        const aIndex = isNumeric
            ? a.dialCode.toLowerCase().indexOf(q)
            : a.name.toLowerCase().indexOf(q);
        const bIndex = isNumeric
            ? b.dialCode.toLowerCase().indexOf(q)
            : b.name.toLowerCase().indexOf(q);

        if (aIndex === -1 && bIndex === -1) {
            return isNumeric
                ? a.dialCode.localeCompare(b.dialCode)
                : a.name.localeCompare(b.name);
        } else if (aIndex === -1) {
            return 1;
        } else if (bIndex === -1) {
            return -1;
        } else {
            return aIndex - bIndex;
        }
    });

    // 合并结果，确保精确匹配的结果在前面
    return exactMatches.concat(fuzzyMatches);
});

// 选择国家
function pick(o: CountryOption) {
    const v = { ...o };
    selected.value = v;
    emit("select", v);
    open.value = false;

    // 记住选择后的滚动位置
    const panel = cdcsContainer.value?.querySelector('.cdcs-list');
    if (panel) {
        panelScrollTop.value = panel.scrollTop;
    }
}

function toggle() {
    open.value = !open.value;
    if (open.value) {
        positionPanel();

        nextTick(() => {
            const panel = cdcsContainer.value?.querySelector('.cdcs-list');
            if (panel) {
                panel.scrollTop = panelScrollTop.value;
            }
        });
    }
}

const cdcsContainer = ref<HTMLElement | null>(null);
const panelTop = ref(0);
const panelBottom = ref(0);

function positionPanel() {
    if (cdcsContainer.value) {
        const { top, bottom } = cdcsContainer.value.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const panelHeight = 340; // 假设面板高度为300px
        panelTop.value = top + windowHeight;
        panelBottom.value = bottom + panelHeight;
        if (panelBottom.value > windowHeight) {
            // 面板向下展开会超出视口，向上展开
            // 这里假设通过添加特定类来实现向上展开
            // 你需要在 CSS 中定义相应的样式
            cdcsContainer.value.classList.add("panel-up");
            cdcsContainer.value.classList.remove("panel-down");
        } else {
            // 否则，向下展开
            cdcsContainer.value.classList.add("panel-down");
            cdcsContainer.value.classList.remove("panel-up");
        }
    }
}
const showDeleteButton = ref(false);

function clearSelection() {
    selected.value = null;
    emit("select", null);
    showDeleteButton.value = false;
    panelScrollTop.value = 0;
}

// 通过ip识别国家
const getCodeByIp = () => {
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            const alpha2 = data.country_code.toLowerCase();
            const found = options.value.find((o) => o.alpha2 === alpha2);
            if (found) {
                selected.value = found;
            }
        }).catch(() => {
        });
}
// 返回选中的国家信息
const getCurrentValue = (): SelectedValue | null => {
    return selected.value ? {...selected.value} : null;
}
// 暴露给外部的接口
defineExpose({ getCurrentValue });

onMounted(() => {
    generateCountryOptions();
    applyInitialSelection();
    DialCodeSelectorProps.autoRecog && !DialCodeSelectorProps.defaultValue && getCodeByIp();

    document.addEventListener("click", (e: any) => {
        if (!e?.target?.closest(".cdcs")) {
            open.value = false;
        }
    });
});
</script>

<template>
    <div
        class="cdcs"
        ref="cdcsContainer">
        <div
            :class="['cdcs-display', DialCodeSelectorProps.selectorClass]"
            @click.stop="toggle"
            @mouseover="showDeleteButton = true"
            @mouseleave="showDeleteButton = false">
            <template v-if="selected">
                <span
                    class="fi"
                    :class="'fi-' + selected.alpha2" />
                <span
                    class="cdcs-code"
                    >{{ selected.dialCode }}</span
                >
            </template>
            <span
                v-else
                class="cdcs-placeholder"
                >{{ DialCodeSelectorProps.placeholder }}</span>
            
            <div class="cdcs-icon">
                <span
                    v-if="clearable && selected && showDeleteButton"
                    class="cdcs-delete"
                    @click.stop="clearSelection">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24">
                        <path
                            fill="#333"
                            d="M8.4 17L7 15.6l3.6-3.6L7 8.425l1.4-1.4l3.6 3.6l3.575-3.6l1.4 1.4l-3.6 3.575l3.6 3.6l-1.4 1.4L12 13.4z" />
                    </svg>
                </span>
                <span :class="['cdcs-arrow', { rotate: open }]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="#000" d="m12.37 15.835l6.43-6.63C19.201 8.79 18.958 8 18.43 8H5.57c-.528 0-.771.79-.37 1.205l6.43 6.63c.213.22.527.22.74 0"/></svg>
                </span>
            </div>
        </div>
        <transition name="cdcs-panel">
            <div
                :class="['cdcs-panel', DialCodeSelectorProps.panelClass]"
                v-if="open">
                <input
                    class="cdcs-search"
                    v-model="search"
                    placeholder="Search" />
                <ul v-if="filtered?.length > 0" class="cdcs-list">
                    <li
                        v-for="o in filtered"
                        :key="o.alpha2"
                        class="cdcs-item"
                        :class="{'highlight': o.alpha2 === selected?.alpha2}"
                        @click="pick(o)">
                        <span
                            class="fi"
                            :class="'fi-' + o.alpha2" />
                        <span class="cdcs-name">{{ o.name }}</span>
                        <span class="cdcs-dial">{{ o.dialCode }}</span>
                    </li>
                </ul>
                <slot v-else name="empty">
                    <div class="cdcs-empty">No results found</div>
                </slot>
            </div>
        </transition>
    </div>
</template>

<style>
.cdcs {
    position: relative;
    text-align: left;
    overflow: visible !important;
}

.cdcs-display {
    min-width: 100px;
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
    background: #fff;
}

.cdcs-placeholder {
    color: #888;
}

.cdcs-code {
    margin: 0 3px;
    font-size: 14px;
    line-height: 1.5;
}

.cdcs-icon {
    display: flex;
    margin-left: auto;
}

.cdcs-arrow {
    display: flex;
    color: #666;
    transition: all 0.2s ease-in-out;
    transform-origin: center;
}

.cdcs-arrow.rotate {
    transform: rotate(180deg);
}

.cdcs-delete {
    display: flex;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.3;
    transition: all 0.2s ease;
}

.cdcs-delete:hover {
    opacity: 1;
}

.cdcs-panel {
    min-width: 300px;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 6px;
    margin-top: 6px;
    z-index: 10;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    text-align: left;
    overflow: hidden!important;
}

.cdcs-search {
    width: 100%;
    padding: 10px 12px;
    border: none;
    border-bottom: 1px solid #eee;
    outline: none;
    box-sizing: border-box;
    font-size: 14px;
}

.cdcs-list {
    max-height: 280px;
    overflow: auto;
    list-style: none;
    margin: 0;
    padding: 6px;
}

.cdcs-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
}

.cdcs-item:hover {
    background: #f6f6f6;
}

.cdcs-item.highlight {
    background: #e0f7fa; /* 绿色高亮背景色 */
}

.cdcs-dial {
    color: #333;
}

.cdcs-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    color: #888;
}

.panel-up .cdcs-panel {
    top: auto;
    bottom: calc(100% + 10px);
}

.cdcs-panel-enter-active,
.cdcs-panel-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.cdcs-panel-enter-from,
.cdcs-panel-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.cdcs-panel-enter-to,
.cdcs-panel-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.panel-up .cdcs-panel-enter-from,
.panel-up .cdcs-panel-leave-to {
    opacity: 0;
    transform: translateY(10px); /* 修改为向上移动 */
}
</style>

