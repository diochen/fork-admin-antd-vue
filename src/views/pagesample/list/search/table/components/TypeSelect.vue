<template>
    <a-select v-model:value="modelValue" allowClear>
      <a-select-option value="" disabled>請選擇</a-select-option>
      <a-select-option value="header">頭部</a-select-option>
      <a-select-option value="footer">底部</a-select-option>
    </a-select>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";

interface TypeSelectSetupData {
    modelValue: string;
}

export default defineComponent({
    name: 'TypeSelect',
    props: {
        value: {
            type: String,
            default: ''
        },
    },
    setup(props, { emit }): TypeSelectSetupData {

        // 數據值
        const modelValue = computed<string>({
            get: () => props.value,
            set: val => {                
                emit('update:value', val || '');
            }
        });

        return {
            modelValue: modelValue as unknown as string
        }



    }
})
</script>