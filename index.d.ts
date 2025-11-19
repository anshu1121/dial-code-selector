import { DefineComponent } from "vue";
import en from "i18n-iso-countries/langs/en.json";

// 国家代码类型（与组件内完全一致）
export type CountryCode =
    | keyof typeof en.countries
    | Lowercase<keyof typeof en.countries>;

// 选择结果类型
export interface SelectedValue {
    alpha2: string;
    dialCode: string;
}

// 对外暴露的 Props 类型（用户传递的属性值类型）
export interface DialCodeSelectorProps {
    defaultValue?: CountryCode;
    selectorClass?: string;
    panelClass?: string;
    placeholder?: string;
    clearable?: boolean;
    autoRecog?: boolean;
    select?: (value: SelectedValue | null) => void;
}

// 事件类型
export type DialCodeSelectorEmits = {
    (e: "select", value: SelectedValue | null): void;
};

// 组件类型（直接使用简化声明，避免复杂泛型推导错误）
export const DialCodeSelector: DefineComponent<
    DialCodeSelectorProps,
    DialCodeSelectorEmits
>;

export default DialCodeSelector;
