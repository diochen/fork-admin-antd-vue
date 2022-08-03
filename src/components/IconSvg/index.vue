<template>
    <svg class="svg-icon" aria-hidden="true">
        <use :xlink:href="`#${type}`" />
    </svg>
</template>
<script lang="ts">
/**
 * 自定義 svg icon
 * @author LiQingSong
 * 使用說明：
 *   1、下載或製作svg文件，存放到/src/assets/iconsvg目錄下
 *   2、項目根據/src/assets/iconsvg/svgo.yml配置自動壓縮精簡svg，也可以獨立運行 npm run svgo 壓縮精簡svg
 *   3、使用Demo：
 *      import IconSvg from '@/components/IconSvg';
 *      import { defineComponent } from "vue";
 *      export default defineComponent({
 *          components: {
 *              IconSvg
 *          }
 *      })
 *      <IconSvg type="svg文件名" class="" style=""/>
 */
import { defineComponent } from "vue";
export default defineComponent({
    name: 'IconSvg',
    props: {
        type: {
            type: String,
            required: true
        }
    }
});
</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>