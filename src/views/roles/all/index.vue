<template>
    <div className="layout-main-conent">
        <a-card :bordered="false">

                <a-alert message="此欄目為權限功能做演示！" type="warning" />


                <a-descriptions
                    title="以下有三個賬號,密碼：123456，你可以登入不同的賬號檢視此欄目下的區別："
                    layout="vertical"
                    bordered
                    style="margin-top: 20px"
                    size="small"
                    >
                    <a-descriptions-item label="admin">
                        超級管理員（擁有所有權限）
                    </a-descriptions-item>
                    <a-descriptions-item label="user">臨時用戶賬號</a-descriptions-item>
                    <a-descriptions-item label="test">臨時測試賬號</a-descriptions-item>
                </a-descriptions>

                <a-alert
                    message="註意：退出賬號後登入其他賬號，請刷新在檢視效果。"
                    type="error"
                    style="margin-top: 20px"
                />

                <a-descriptions
                    title="此頁麵所有用戶都可以檢視，以下隻做操作按鈕權限演示，頁麵權限請登入不同賬號檢視左側欄目對應菜單區別。"
                    layout="vertical"
                    bordered
                    :column="1"
                    style="margin-top: 20px"
                    size="small"
                    >
                    <a-descriptions-item label="不做驗證的操作按鈕">
                        <a-button type="primary">編輯</a-button>
                        <a-button type="primary" danger> 刪除</a-button>
                    </a-descriptions-item>

                    <a-divider><h3>Permission 組件使用方法：</h3></a-divider>

                    <a-descriptions-item label="user賬號可操作按鈕">
                        <Permission roles="user">
                            <template #otherwise>無權操作，此參數可賦值為空！</template>
                            <a-button type="primary">編輯</a-button>
                            <a-button type="primary" danger>
                                刪除
                            </a-button>
                        </Permission>
                    </a-descriptions-item>
                    <a-descriptions-item label="test賬號可操作按鈕">
                        <Permission roles="test">
                            <template #otherwise>無權操作，此參數可賦值為空！</template>
                            <a-button type="primary">編輯</a-button>
                            <a-button type="primary" danger>
                                刪除
                            </a-button>
                        </Permission>
                    </a-descriptions-item>

                    <a-divider><h3>v-permission 指令使用方法：</h3></a-divider>

                    <a-descriptions-item label="user賬號可操作按鈕">
                            <a-button v-permission="'user'" type="primary">編輯</a-button>
                            <a-button v-permission="'user'" type="primary" danger>刪除</a-button>
                    </a-descriptions-item>
                    <a-descriptions-item label="test賬號可操作按鈕">
                            <a-button v-permission="'test'" type="primary">編輯</a-button>
                            <a-button v-permission="'test'" type="primary" danger>刪除 </a-button>
                    </a-descriptions-item>


                </a-descriptions>

          
        </a-card>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Permission from "@/components/Permission/index.vue";
import vPermission from '@/directives/permission';
export default defineComponent({
    name: 'RolesAll',
    components: {
        Permission
    },
    directives: {
        permission: vPermission
    }
})
</script>