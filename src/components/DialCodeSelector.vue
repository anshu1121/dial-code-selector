<script setup lang="ts">
import { ref, computed, onMounted, defineProps } from "vue";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { getCountryCallingCode } from "libphonenumber-js";

type CountryCode = keyof typeof en.countries | Lowercase<keyof typeof en.countries>;

// 类型定义
type SelectedValue = { 
    alpha2: string; // 国家简称
    dialCode: string; // 电话区号
};

type CountryOption = {
    alpha2: string; // 国家简称
    name: string;   // 国家全称
    dialCode: string;   // 电话区号
};

type Props = {
    defaultValue?: CountryCode;  // 国家代码，如 'us', 'cn'
    selectorClass?: string; // 下拉框类名
    panelClass?: string; // 下拉面板类名
    placeholder?: string; // 下拉框提示文字
};

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'select country'
});
const emit = defineEmits<{
    (e: "select", v: SelectedValue): void;
}>();

const options = ref<CountryOption[]>([]);
const search = ref("");
const open = ref(false);
const selected = ref<SelectedValue | null>(null);

// 生成国家选项列表
const generateCountryOptions = () => {
    countries.registerLocale(en);
    const names = countries.getNames("en", { select: "alias" }) as Record<string, string>;
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
    if (!props.defaultValue) return;
    
    const alpha2 = props.defaultValue.toLowerCase();
    const found = options.value.find((o) => o.alpha2 === alpha2);
    if (found) {
        selected.value = found;
    }
}

// 过滤选项
const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return options.value;
    
    return options.value.filter(
        (o) => o.name.toLowerCase().includes(q) || o.alpha2.includes(q)
    );
});

// 选择国家
function pick(o: CountryOption) {
    const v = { ...o };
    selected.value = v;
    emit("select", v);
    open.value = false;
}

function toggle() {
    open.value = !open.value;
}

onMounted(() => {
    generateCountryOptions();
    applyInitialSelection();
    
    document.addEventListener("click", (e: any) => {
        if (!e?.target?.closest(".cdcs")) {
            open.value = false;
        }
    });
});
</script>

<template>
    <div class="cdcs">
        <div
            :class="['cdcs-display', props.selectorClass]"
            @click.stop="toggle">
            <span
                v-if="selected"
                class="fi"
                :class="'fi-' + selected.alpha2" />
            <span
                v-if="selected"
                class="cdcs-code"
                >{{ selected.dialCode }}</span>
            <span
                v-else
                class="cdcs-placeholder"
                >{{ props.placeholder }}</span>
            <span class="cdcs-arrow">▾</span>
        </div>
        <div
            :class="['cdcs-panel', props.panelClass]"
            v-show="open">
            <input
                class="cdcs-search"
                v-model="search"
                placeholder="Search" />
            <ul class="cdcs-list">
                <li
                    v-for="o in filtered"
                    :key="o.alpha2"
                    class="cdcs-item"
                    @click="pick(o)">
                    <span
                        class="fi"
                        :class="'fi-' + o.alpha2" />
                    <span class="cdcs-name">{{ o.name }}</span>
                    <span class="cdcs-dial">{{ o.dialCode }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
/* 样式保持不变 */
.cdcs {
    position: relative;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    text-align: left;
    overflow: visible;
}
.cdcs-display {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px 10px;
    cursor: pointer;
    background: #fff;
}
.cdcs-placeholder {
    color: #888;
}
.cdcs-code {
    font-weight: 600;
}
.cdcs-arrow {
    margin-left: auto;
    color: #666;
}
.cdcs-panel {
    width: 300px;
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
    overflow: hidden;
}
.cdcs-search {
    width: 100%;
    padding: 12px;
    border: none;
    border-bottom: 1px solid #eee;
    outline: none;
    box-sizing: border-box;
    font-size: 16px;
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
.fi {
    width: 1.2em;
    height: 1.2em;
}
.cdcs-dial {
    color: #333;
    font-weight: 500;
}
</style>
