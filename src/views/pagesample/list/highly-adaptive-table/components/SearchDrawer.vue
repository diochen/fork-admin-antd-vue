<template>
    <a-drawer
      placement="right"
      :width="360"
      :title="title"
      :closable="false"
      :onClose="onClose"
      :visible="visible"
    >
        
        <a-form layout="vertical"  :wrapper-col="{span:24}">
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

        <div :style="{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
        }">
            <div class="text-align-right">
                <a-button style="margin-right: 8px" @click="onClose">
                    取消
                </a-button>
                <a-button type="primary" @click="onSearch">
                    搜索
                </a-button>
            </div>
        </div>

      
    </a-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive } from "vue";

import { Form } from 'ant-design-vue';
const useForm = Form.useForm;

import TypeSelect from './TypeSelect.vue';
import { TableListItem } from "../data.d";


export default defineComponent({
    name: 'SearchDrawer',
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            default: '高級搜索'
        },
        onClose: {
            type: Function,
            required: true
        },
        onSubmit: {
            type: Function as PropType<(values: Omit<TableListItem, 'id'>) => void>,
            required: true
        }
    },
    components: {
        TypeSelect
    },
    setup(props) {

        // 錶單值
        const modelRef = reactive<Omit<TableListItem, 'id'>>({
            name: '',
            desc: '',
            href: '',
            type: ''
        });
        // 錶單驗證
        const rulesRef = reactive({
            name: [],
            desc: [], 
            href: [],
            type: []         
        });
        // 獲取錶單內容
        const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

        const onSearch = async () => {
             try {
                const fieldsValue = await validate<Omit<TableListItem, 'id'>>();
                props.onSubmit(fieldsValue);
            } catch (error) {
                // console.log('error', error);
            }
        }

        return {
            modelRef,
            validateInfos,
            resetFields,
            onSearch
        }


    }

})
</script>