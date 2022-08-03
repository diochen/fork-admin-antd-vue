<template>
    <Icons :type="type" />
</template>
<script lang="ts">
/**
 * Layout icon , 主要用於菜單
 * @author LiQingSong
 * 使用說明：
 *   >>> 在這裏可以對以下字體圖示進行引入替換，達到 IndexLayout icon 統一效果：
 *     import Icons from '@/components/IconSvg';
 *     import Icons from '@/components/IconFont';
 */
import { defineComponent } from "vue";
import Icons from "@/components/IconSvg";
// import Icons from '@/components/IconFont';
export default defineComponent({
    name: 'Icon',
    props: {
        type: {
            type: String,
            required: true
        }
    },
    components: {
        Icons
    }
})
</script>
