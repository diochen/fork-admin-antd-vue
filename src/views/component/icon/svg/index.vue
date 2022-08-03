<template>
    <div className="layout-main-conent">
        <a-card :bordered="false">

             <div v-for="item in svgIcons" class="list" :key="item" >
                <a-popover>
                    <template #content>
                        &lt;icon-svg type="{{item}}" /&gt;
                    </template>
                    <div>
                        <icon-svg :type="item" style="font-size: 30px" />
                        <span>{{item}}</span>
                    </div>
                </a-popover>
              </div>

              <a-divider />

                <a-list>
                    <template #header><h2>{{t('page.icon.svg.remark.title')}}</h2></template>
                    <a-list-item> 組件位置： @/components/IconSvg</a-list-item>
                    <a-list-item> 創建原因：方便自定義使用svg圖示 </a-list-item>
                </a-list>
                <a-list>
                    <template #header><h2>使用方法：</h2></template>
                    <a-list-item>
                        1、下載或製作svg文件，存放到 <a-tag>@/assets/iconsvg</a-tag>
                        目錄下，自己可以對此目錄下svg進行刪減。
                    </a-list-item>
                    <a-list-item>
                        2、項目會根據 <a-tag>@/assets/iconsvg/svgo.yml</a-tag>
                        配置自動壓縮精簡svg，也可以獨立運行 <a-tag>yarn svgo</a-tag> 或
                        <a-tag>npm run svgo</a-tag>壓縮精簡svg
                    </a-list-item>
                    <a-list-item>3、使用Demo：</a-list-item>
                    <a-list-item>import IconSvg from '@/components/IconSvg';</a-list-item>
                    <a-list-item>
                        &lt;IconSvg type="svg文件名" class="" style=""/&gt;
                    </a-list-item>
                </a-list>

          
        </a-card>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import IconSvg from "@/components/IconSvg";

const svgIcons: string[] = [];
const svgRequireModules = import.meta.globEager('../../../../assets/iconsvg/**.svg');
for (const path in svgRequireModules) {
    const modulesName = path.replace(/(.*\/)*([^.]+).*/ig,"$2");
    svgIcons.push(modulesName)
}


export default defineComponent({
    components: {
        IconSvg
    },
    setup() {
        const { t } = useI18n();

        return {
            t,
            svgIcons
        }
    }
})
</script>
<style lang="less" scoped>
.list {
  padding: 10px 20px;
  width: 100px;
  height: 100px;
  float: left;
  text-align: center;
  font-size: 30px;
  overflow: hidden;
  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>