<template>
    <div class="layout-main-conent">
        <a-form  :wrapper-col="{span:24}">
            <a-card :bordered="false"  title="基礎信息" style="margin-bottom: 20px">
                <a-row :gutter="16">
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item label="標題：" v-bind="validateInfos.title">
                            <a-input v-model:value="modelRef.title" placeholder="請輸入" />
                        </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item label="起止日期" v-bind="validateInfos.date">
                            <a-range-picker v-model:value="modelRef.date" style="width:100%" />
                        </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item label="下拉選擇" v-bind="validateInfos.select">
                            <a-select v-model:value="modelRef.select"  placeholder="請選擇" allowClear>
                                <a-select-option value="1">select1</a-select-option>
                                <a-select-option value="2">select2</a-select-option>
                                <a-select-option value="3">select3</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item label="單選按鈕1">
                            <a-radio-group  v-model:value="modelRef.radio1" >
                                <a-radio value="1">item 1</a-radio>
                                <a-radio value="2">item 2</a-radio>
                                <a-radio value="3">item 3</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>                
            </a-card>

            <a-card :bordered="false"  title="拓展信息" style="margin-bottom: 20px">
                <a-row :gutter="16">
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item label="單選按鈕2"  v-bind="validateInfos.radio2">
                            <a-radio-group  v-model:value="modelRef.radio2" >
                                <a-radio-button value="1">item 1</a-radio-button>
                                <a-radio-button value="2">item 2</a-radio-button>
                                <a-radio-button value="2">item 3</a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item label="複選框" v-bind="validateInfos.checkbox">
                            <a-checkbox-group v-model:value="modelRef.checkbox">
                                <a-checkbox value="1" name="type">
                                Online
                                </a-checkbox>
                                <a-checkbox value="2" name="type">
                                Promotion
                                </a-checkbox>
                                <a-checkbox value="3" name="type">
                                Offline
                                </a-checkbox>
                            </a-checkbox-group>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item label="備註" v-bind="validateInfos.remark">
                            <a-textarea v-model:value="modelRef.remark" :rows="1" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-card>

            <a-card :bordered="false"  title="錶格信息">
                <a-form-item label="" v-bind="validateInfos.users">
                    <TableForm v-model:value="modelRef.users" />
                </a-form-item>
            </a-card>




            <form-footer-toolbar>
                <a-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</a-button>
                <a-button @click="resetFields" style="margin-left: 10px;">重置</a-button>  
            </form-footer-toolbar>


        </a-form>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, Ref, ref } from "vue";
import { useStore } from "vuex";

import { Props, validateInfos } from 'ant-design-vue/lib/form/useForm';
import { message, Form } from 'ant-design-vue';
const useForm = Form.useForm;

import { FormDataType } from "./data.d";
import { StateType as FormStateType } from "./store";
import TableForm from './components/TableForm/index.vue';
import FormFooterToolbar from "@/components/FormFooterToolbar/index.vue";

interface FormComplexPageSetupData {
    resetFields: (newValues?: Props) => void;
    validateInfos: validateInfos;
    modelRef: FormDataType;
    submitLoading: Ref<boolean>;
    handleSubmit: (e: MouseEvent) => void;
}

export default defineComponent({
    name: 'FormComplexPage',
    components: {
        TableForm,
        FormFooterToolbar
    },
    setup(): FormComplexPageSetupData {

        const store = useStore<{FormComplex: FormStateType}>();

        // 錶單值
        const modelRef = reactive<FormDataType>({
            title: '',
            date: [],
            select: '',
            radio1: '',
            radio2: '',
            checkbox: [],
            remark: '',
            users: []
        });
        // 錶單驗證
        const rulesRef = reactive({
            title: [
                {
                    required: true,
                    message: '必填',
                },
            ],
            date: [
                {
                    required: true,
                    message: '必填',
                    trigger: 'change', 
                    type: 'array' 
                },
            ],  
            select: [
                {
                    required: true,
                    message: '請選擇',
                },
            ],  
            radio1: [],  
            radio2: [
                {
                    required: true,
                    message: '請選擇',
                },
            ],
            checkbox:[],
            remark: [],
            users: []      
        });
        // 獲取錶單內容
        const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
        // 重置 validateInfos 如果用到國際化需要此步驟
        //const validateInfosNew = useI18nAntdFormVaildateInfos(validateInfos);

        // 登入loading
        const submitLoading = ref<boolean>(false);
        // 登入
        const handleSubmit = async (e: MouseEvent) => {
            e.preventDefault();
            submitLoading.value = true;
            try {
                const fieldsValue = await validate<FormDataType>();
                const res: boolean = await store.dispatch('FormComplex/create',fieldsValue);                
                if (res === true) {
                    message.success('提交成功');
                    resetFields();                    
                }
            } catch (error) {
                // console.log('error', error);
            }
            submitLoading.value = false;
        };

        return {
            resetFields,
            validateInfos,
            modelRef,
            submitLoading,
            handleSubmit,
        }



    }
})
</script>