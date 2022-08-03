<template>
    <div 
        :style="{
          position: 'fixed',
          display: 'block',
          width: '45px',
          height: '45px',
          lineHeight: '48px',
          right: '0',
          top: '30%',
          backgroundColor: '#222834',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '5px 0 0 5px',
        }"
        @click="show" 
    >
        <SettingOutlined :style="{ fontSize: '20px', color: '#fcfcfc' }" />
    </div>
    <a-drawer
        title="係統佈局配置"
        :visible="visible"
        @close="close"
        :bodyStyle="{ padding: '10px' }"
    >
        <a-list size="small">
            <a-list-item>
                <template #actions>
                    <a-switch :checked="topNavEnable" @change="onChangeTopNavEnable" />
                </template>
                啓用頂部導航
            </a-list-item>
            <a-list-item>
                <template #actions>
                    <a-switch :checked="headFixed" @change="onChangeHeadFixed" :disabled="disabledHeadFixed" />
                </template>
                固定右側頭部
            </a-list-item>
            <a-list-item>
                <template #actions>
                    <a-switch :checked="tabNavEnable" @change="onChangeTabNavEnable" />
                </template>
                啓用TabNav
            </a-list-item>            
        </a-list>
    </a-drawer>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref } from "vue";
import { useStore } from 'vuex';
import { StateType as GlobalStateType } from '@/store/global';
import { SettingOutlined } from '@ant-design/icons-vue';

interface SettingsSetupData {
    visible: Ref<boolean>;
    close: () => void;
    show: () => void;
    topNavEnable: ComputedRef<boolean>;
    onChangeTopNavEnable: (v: boolean) => void;
    tabNavEnable: ComputedRef<boolean>;
    onChangeTabNavEnable: (v: boolean) => void;
    headFixed: Ref<boolean>;
    onChangeHeadFixed: (v: boolean) => void;
    disabledHeadFixed: Ref<boolean>;
}

export default defineComponent({
    name: 'Settings',
    components: {
        SettingOutlined
    },
    setup(): SettingsSetupData {
        
        const store = useStore<{global: GlobalStateType}>(); 

        const visible = ref<boolean>(false);
        // 關閉
        const close = (): void => {
            visible.value = false;
        }
        // 顯示
        const show = (): void => {
            visible.value = true;
        }

        // 固定右側頭部
        const disabledHeadFixed = ref<boolean>(true);
        const headFixed = computed<boolean>(()=> store.state.global.headFixed);
        const onChangeHeadFixed = (v: boolean): void => {
            store.commit('global/setHeadFixed', v);
        }

        // 啓用頂部導航
        const topNavEnable = computed<boolean>(()=> store.state.global.topNavEnable);
        const onChangeTopNavEnable = (v: boolean): void => {
            store.commit('global/setTopNavEnable', v);

            if (v) {
                disabledHeadFixed.value = true;
                onChangeHeadFixed(true);
            } else {
                disabledHeadFixed.value = false;
            }

        }  
        
        // 啓用TabNav
        const tabNavEnable = computed<boolean>(()=> store.state.global.tabNavEnable);
        const onChangeTabNavEnable = (v: boolean): void => {
            store.commit('global/setTabNavEnable', v);
        }  


        return {
            visible,
            close,
            show,
            topNavEnable,
            onChangeTopNavEnable,
            tabNavEnable,
            onChangeTabNavEnable,
            headFixed,
            onChangeHeadFixed,
            disabledHeadFixed
        }

    }
})
</script>