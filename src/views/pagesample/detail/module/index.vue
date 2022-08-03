<template>
    <div class="layout-main-conent">
        <a-spin :spinning="loading" size="large">
            <a-card :bordered="false" title="退款申請" style="margin-bottom: 20px">

                <a-descriptions >
                    <a-descriptions-item label="取貨單號">
                    {{refundApplication.ladingNo}}
                    </a-descriptions-item>
                    <a-descriptions-item label="狀態">
                    {{refundApplication.state}}
                    </a-descriptions-item>
                    <a-descriptions-item label="銷售單號">
                    {{refundApplication.saleNo}}
                    </a-descriptions-item>
                    <a-descriptions-item label="子訂單">
                    {{refundApplication.childOrders}}
                    </a-descriptions-item>
                </a-descriptions>
            </a-card>

            <a-card :bordered="false" title="用戶信息" style="margin-bottom: 20px">

                <a-descriptions>
                    <a-descriptions-item label="用戶姓名">
                    {{userInfo.name}}
                    </a-descriptions-item>
                    <a-descriptions-item label="聯係電話">
                    {{userInfo.tel}}
                    </a-descriptions-item>
                    <a-descriptions-item label="常用快遞">
                    {{userInfo.courier}}
                    </a-descriptions-item>
                    <a-descriptions-item label="取貨地址">
                    {{userInfo.address}}
                    </a-descriptions-item>
                    <a-descriptions-item label="備註">
                    {{userInfo.remark}}
                    </a-descriptions-item>
                </a-descriptions>

            </a-card>
            <a-card :bordered="false" title="退貨商品" style="margin-bottom: 20px">
                <a-table
                    rowKey="id"
                    :pagination="false"
                    :dataSource="goodsData"
                    :columns="goodsColumns"
                />
            </a-card>

            <a-card :bordered="false" title="退貨進度">
                <a-table
                    :pagination="false"
                    :dataSource="returnProgress"
                    :columns="progressColumns"
                >
                    <template #status="{ text }">
                        <a-badge v-if="text === 'success'" status="success" text="成功" />
                        <a-badge v-else status="processing" text="進行中" />;
                    </template>
                </a-table>
            </a-card>

        </a-spin>        
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, h, Ref, ComputedRef } from "vue";
import { useStore } from 'vuex';
import { StateType as DetailStateType } from './store';
import { RefundApplicationDataType, ReturnGoodsDataType, ReturnProgressDataType, UserInfoDataType } from './data.d';

interface DetailBasicPageSetupData {
    loading: Ref<boolean>;
    refundApplication: ComputedRef<RefundApplicationDataType>;
    userInfo: ComputedRef<UserInfoDataType>;
    goodsColumns: any;
    goodsData: ComputedRef<ReturnGoodsDataType[]>;
    progressColumns: any;
    returnProgress: ComputedRef<ReturnProgressDataType[]>;
}

export default defineComponent({
    name: 'DetailModulePage',
    setup(): DetailBasicPageSetupData {
        const store = useStore<{ DetailModule: DetailStateType}>();

        // 退款申請 信息
        const refundApplication = computed<RefundApplicationDataType>(() => store.state.DetailModule.detail.refundApplication);

        // 用戶信息
        const userInfo = computed<UserInfoDataType>(() => store.state.DetailModule.detail.userInfo);

        // 退貨商品
        const returnGoods = computed<ReturnGoodsDataType[]>(() => store.state.DetailModule.detail.returnGoods);
        const goodsData = computed<ReturnGoodsDataType[]>(() => {
            let goodsData: typeof returnGoods.value = [];
            if (returnGoods.value.length) {
                let num = 0;
                let amount = 0;
                returnGoods.value.forEach(item => {
                    num += Number(item.num);
                    amount += Number(item.amount);
                });
                goodsData = returnGoods.value.concat({
                    id: '總計',
                    num,
                    amount,
                });
            }
            return goodsData;
        });
        const renderContent = ({text, index}: {text: any; index: number}) => {
            const obj: {
                children: any;
                props: { colSpan?: number };
            } = {
                children: text,
                props: {},
            };
            if (index === returnGoods.value.length) {
                obj.props.colSpan = 0;
            }
            return obj;
        };
        const goodsColumns = [
            {
                title: '商品編號',
                dataIndex: 'id',
                customRender: ({text, index}: { text: any; index: number}) => {
                    if (index < returnGoods.value.length) {
                        return h('a',{
                            href: 'javascript:;'
                        }, text);
                    }
                    return {
                        children: h('span',{style:"font-weight: 600"},'總計'),
                        props: {
                            colSpan: 4,
                        },
                    };
                },
            },
            {
                title: '商品名稱',
                dataIndex: 'name',
                key: 'name',
                customRender: renderContent,
            },
            {
                title: '商品條碼',
                dataIndex: 'barcode',
                key: 'barcode',
                customRender: renderContent,
            },
            {
                title: '單價',
                dataIndex: 'price',
                key: 'price',
                align: 'right' as 'left' | 'right' | 'center',
                customRender: renderContent,
            },
            {
                title: '數量（件）',
                dataIndex: 'num',
                key: 'num',
                align: 'right' as 'left' | 'right' | 'center',
                customRender: ({text, index}: { text: any; index: number}) => {
                    if (index < returnGoods.value.length) {
                        return text;
                    }
                    return h('span',{style:"font-weight: 600"},text)
                },
            },
            {
                title: '金額',
                dataIndex: 'amount',
                key: 'amount',
                align: 'right' as 'left' | 'right' | 'center',
                customRender: ({text, index}: { text: any; index: number}) => {
                    if (index < returnGoods.value.length) {
                        return text;
                    }
                    return h('span',{style:"font-weight: 600"},text)
                },
            },
        ];

        // 退貨進度
        const returnProgress = computed<ReturnProgressDataType[]>(() => store.state.DetailModule.detail.returnProgress);
        const progressColumns = [
            {
                title: '時間',
                dataIndex: 'time',
            },
            {
                title: '當前進度',
                dataIndex: 'rate',
            },
            {
                title: '狀態',
                dataIndex: 'status',
                slots: { customRender: 'status' },
            },

            {
                title: '操作員ID',
                dataIndex: 'operator',
            },
            {
                title: '耗時',
                dataIndex: 'cost',
            },
        ];


        // 讀取數據 func
        const loading = ref<boolean>(true);
        const getData = async () => {
            loading.value = true;
            await store.dispatch('DetailModule/queryDetail');
            loading.value = false;
        }

        onMounted(()=> {
           getData();
        })


        return {
            loading,
            refundApplication,
            userInfo,
            goodsColumns,
            goodsData,
            progressColumns,
            returnProgress
        }
    }
})
</script>