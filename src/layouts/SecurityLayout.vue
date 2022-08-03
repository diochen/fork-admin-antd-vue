<template>
    <a-result v-if="(!isLogin && loading) || !isReady">
        <template #icon>
            <a-spin size="large" />
        </template>
    </a-result>
    <router-view v-if="isLogin" />
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { StateType as UserStateType, CurrentUser } from "@/store/user";

interface SecurityLayoutSetupData {
    isLogin: ComputedRef<boolean>;
    loading: Ref<boolean>;
    getUser: () => Promise<void>;
    isReady: Ref<boolean>;
}

export default defineComponent({
    name: 'SecurityLayout',
    setup(): SecurityLayoutSetupData {
        const router = useRouter();
        const store = useStore<{user: UserStateType}>();

        // 獲取當前登入用戶信息
        const currentUser = computed<CurrentUser>(()=> store.state.user.currentUser);

        // 判斷是否登入
        const isLogin = computed<boolean>(()=> currentUser.value ? currentUser.value.id > 0 : false);

        // 讀取當前用戶信息func
        const isReady = ref<boolean>(false); // 是否讀取過用戶信息
        const loading = ref<boolean>(false);
        const getUser = async () => {
            loading.value = true;
            await store.dispatch('user/fetchCurrent');
            if(!isLogin.value && router.currentRoute.value.path !== '/user/login') {
                router.replace({
                    path: '/user/login',
                    query: {
                        redirect: router.currentRoute.value.path,
                        ...router.currentRoute.value.query
                    }
                })
            }            
            loading.value = false;
            isReady.value = true;
        }

        onMounted(() => {
            getUser();
        })


        return {
            isLogin,
            loading,
            getUser,
            isReady
        }


    }
})
</script>