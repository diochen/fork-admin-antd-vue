<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    beforeRouteEnter(to, from, next) {
        // 在渲染該組件的對應路由被驗證前調用
        // 不能獲取組件實例 `this` ！
        // 因為當守衛執行時，組件實例還冇被創建！
        // console.log('refresh', to, from, next)
        next(vm => {
            vm.$router.replace(from);
            // 跳到該路由頁麵後，再替換為from來源
        })
    },

})
</script>
