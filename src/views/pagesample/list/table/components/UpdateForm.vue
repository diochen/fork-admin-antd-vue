<template>
    <a-modal
      :destroy-on-close="true"
      :mask-closable="false"
      title="編輯"
      :visible="visible"
      :onCancel="onCancel"
    >
        <template #footer>
            <a-button key="back" @click="() => onCancel()">取消</a-button>
            <a-button key="submit" type="primary" :loading="onSubmitLoading" @click="onFinish">提交</a-button>
        </template>
        
        <a-form :labelCol="{ span: 4 }" :wrapper-col="{span:20}">
            <a-form-item label="位置" v-bind="validateInfos.type">
                <TypeSelect v-model:value="modelRef.type" placeholder="請選擇" />
            </a-form-item>
            <a-form-item label="名稱" v-bind="validateInfos.name">
                <a-input v-model:value="modelRef.name" placeholder="請輸入名稱" />
            </a-form-item>
            <a-form-item label="網址" v-bind="validateInfos.href">
                <a-input v-model:value="modelRef.href" placeholder="請輸入網址" />
            </a-form-item>

            <a-form-item label="備註" v-bind="validateInfos.desc">
                <a-input v-model:value="modelRef.desc" placeholder="請輸入備註" />
            </a-form-item>
        </a-form>


    </a-modal>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive } from "vue";
import { useI18n } from "vue-i18n";

import { Props, validateInfos } from 'ant-design-vue/lib/form/useForm';
import { message, Form } from 'ant-design-vue';
const useForm = Form.useForm;

import TypeSelect from './TypeSelect.vue';
import { TableListItem } from "../data.d";

interface UpdateFormSetupData {
    modelRef: Omit<TableListItem, 'id'>;
    validateInfos: validateInfos;
    onFinish: () => Promise<void>;
}

export default defineComponent({
    name: 'UpdateForm',
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        values: {
            type: Object as PropType<Partial<TableListItem>>,
            required: true
        },
        onCancel: {
            type: Function,
            required: true
        },
        onSubmitLoading: {
            type: Boolean,
            required: true
        },
        onSubmit: {
            type: Function as PropType<(values: TableListItem, resetFields: (newValues?: Props | undefined) => void) => void>,
            required: true
        }
    },
    components: {
        TypeSelect
    },
    setup(props): UpdateFormSetupData {

        const { t } = useI18n();

        // 錶單值
        const modelRef = reactive<TableListItem>({
            id: props.values.id || 0,
            name: props.values.name || '',
            desc: props.values.desc || '',
            href: props.values.href || '',
            type: props.values.type || ''
        });
        // 錶單驗證
        const rulesRef = reactive({
            id: [],
            name: [
                {
                    required: true,
                    validator: async (rule: any, value: string) => {
                        if (value === '' || !value) {
                            throw new Error('請輸入名稱');
                        } else if (value.length > 15) {
                            throw new Error('長度不能大於15個字');
                        }
                    }
                },
            ],
            desc: [], 
            href: [
                {
                    required: true,
                    validator: async (rule: any, value: string) => {
                        if (value === '' || !value) {
                            throw new Error('請輸入網址');
                        } else if (!/^(https?:)/.test(value)) {
                            throw new Error('請輸入正確的網址');
                        }
                    },
                },
            ],
            type: [
                {
                    required: true,
                    message: '請選擇'
                }
            ]         
        });
        // 獲取錶單內容
        const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
        // 提交
        const onFinish = async () => {           
            try {
                const fieldsValue = await validate<TableListItem>();
                props.onSubmit(fieldsValue, resetFields);
            } catch (error) {
                // console.log('error', error);
                message.warning(t('app.global.form.validatefields.catch'));
            }
        };
        
        return {
            modelRef,
            validateInfos,
            onFinish
        }

    }
})
</script>