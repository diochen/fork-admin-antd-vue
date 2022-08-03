<template>
    <div class="universallayout-top-tab-nav">
        <div class="left" @click="handleScroll(200)">
             <icon-svg class="icon" type="arrow-left"  />
        </div>
        <div class="middle" ref="scrollBox" @DOMMouseScroll="handleRolling" @mousewheel="handleRolling">
            <div class="tab" ref="scrollContent" :style="{transform: `translateX(${translateX}px)`}">
                <span :ref="tabNavSpanRef" v-for="(item, index) in tabNavList" :key="`tab-nav-${index}`" class="item" :class="{'active': equalTabNavRView(route, item.route, item.menu.tabNavType)}" @click="toRoute(item,index)">
                    <icon-svg class="icon-pre" type="refresh" @click.stop="refreshCurrentTabNav(item)"  />
                    <span>{{t(item.menu.title)}}</span>
                    <icon-svg v-if="item.menu.path!==homeRouteItemPath" class="icon" type="close" @click.stop="closeCurrentTabNav(item, index)" />
                </span>
            </div>
        </div>
        <div class="right"  @click="handleScroll(-200)">
            <icon-svg class="icon" type="arrow-right"  />
        </div>
        <div class="down">
            <a-dropdown>
                <span class="icon-box">
                    <icon-svg class="icon" type="more"  />
                </span>
                <template #overlay>
                    <a-menu @click="(e)=>handleCommandMore(e.key)">
                        <a-menu-item key="closeleft"><icon-svg class="icon-dropdown-menu" type="arrow-left2"  /> 關閉左側</a-menu-item>
                        <a-menu-item key="closeright"><icon-svg class="icon-dropdown-menu" type="arrow-right2"  /> 關閉右側</a-menu-item>
                        <a-menu-item key="closeother"><icon-svg class="icon-dropdown-menu" type="close"  /> 關閉其他</a-menu-item>
                        <a-menu-item key="closeall"><icon-svg class="icon-dropdown-menu" type="close2"  /> 關閉所有</a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </div>
</template>
<script lang="ts" setup>

import { withDefaults, defineProps, computed, ref, toRefs, watch, onBeforeUpdate, onMounted, nextTick } from "vue"
import { useStore } from 'vuex'
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from 'vue-router'
import { RoutesDataItem, equalTabNavRoute, TabNavItem } from '@/utils/routes'
import { StateType as GlobalStateType } from "@/store/global"
import IconSvg from "@/components/IconSvg"
import settings from '@/config/settings'
const homeRouteItemPath = settings.homeRouteItem.path;


interface Props {
  routeItem: RoutesDataItem;
}

const props = withDefaults(defineProps<Props>(), {})
const { routeItem } = toRefs(props)

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const store = useStore<{global: GlobalStateType}>();

const tabNavList = computed<TabNavItem[]>(()=> store.state.global.headTabNavList);
const equalTabNavRView = equalTabNavRoute;


const translateX = ref<number>(0);
const scrollBox = ref<HTMLDivElement>();
const scrollContent = ref<HTMLDivElement>();
const handleScroll = (offset: number): void => {
    const boxWidth = scrollBox.value ? scrollBox.value.offsetWidth : 0;
    const contentWidth = scrollContent.value ? scrollContent.value.offsetWidth : 0;
    if(offset > 0) {
        translateX.value = Math.min(0, translateX.value + offset)
    } else {
        if (boxWidth < contentWidth) {
            if (translateX.value >= -(contentWidth - boxWidth)) {
                translateX.value = Math.max(translateX.value + offset, boxWidth - contentWidth)
            }
        } else {
            translateX.value = 0;
        }
    }

}

// 滑鼠滾動
const handleRolling = (e: any) => {
    const type = e.type
    let delta = 0
    if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
    }
    handleScroll(delta)
}

// 設定tabItem位置
let tabNavSpanRefs: any = [];
const tabNavSpanRef = (el: any) => {
    tabNavSpanRefs.push(el)
}
onBeforeUpdate(() => {
    tabNavSpanRefs = []
})


const tabNavPadding = 10;
const moveToView = (index: number): void => {
    if(!tabNavSpanRefs[index]) {
        return;
    }
    const tabItemEl = tabNavSpanRefs[index];
    const tabItemElOffsetLeft = tabItemEl.offsetLeft;
    const tabItemOffsetWidth = tabItemEl.offsetWidth;
    // console.log('taboffsetleft', tabItemElOffsetLeft, 'taboffsetwidth', tabItemOffsetWidth)
    const boxWidth = scrollBox.value ? scrollBox.value.offsetWidth : 0;
    const contentWidth = scrollContent.value ? scrollContent.value.offsetWidth : 0;
    if(contentWidth < boxWidth || tabItemElOffsetLeft===0) {
        translateX.value = 0;
    } else if (tabItemElOffsetLeft < -translateX.value) {
        // 標簽在可視區域左側
        translateX.value = -tabItemElOffsetLeft + tabNavPadding;
    }else if (tabItemElOffsetLeft > -translateX.value && tabItemElOffsetLeft + tabItemOffsetWidth < -translateX.value + boxWidth) {
        // 標簽在可視區域
        translateX.value = Math.min(0, boxWidth - tabItemOffsetWidth - tabItemElOffsetLeft - tabNavPadding)
    } else {
        // 標簽在可視區域右側
        translateX.value = -(tabItemElOffsetLeft - (boxWidth - tabNavPadding - tabItemOffsetWidth))
    }


}


// 設定TabNav
const setTabNav = (): void => {

  /**
   * 隻有當前路由的path和當前定義路由規則的path一緻才會繼續執行，
   * 因為 routeItem 是經過computed獲取後傳過來的，存在異步情況
   */
  if(route.path!==routeItem.value.path) {
      return;
  }

  // 數組裏是否已經存在當前route規則，不存在下標為-1
  let index = tabNavList.value.findIndex(item => equalTabNavRoute(item.route, route, routeItem.value.tabNavType))
  if(index < 0) {
      index = tabNavList.value.length;
      store.commit('global/setHeadTabNavList', [
          ...tabNavList.value,
          {
              route: {
                  ...route
              },
              menu: {
                  ...routeItem.value
              }
          }
      ]);
  }

  nextTick(() => {
    moveToView(index)
  })
}

// 關閉TabNav
const closeTabNav = (item: TabNavItem, index: number): void => {

    // 判斷關閉的是否是當前打開的tab
    let isRouterPush: boolean | TabNavItem = false;
    if(equalTabNavRoute(route, item.route, item.menu.tabNavType)) {
        isRouterPush = tabNavList.value[index-1]
    }

    let navList: TabNavItem[] = tabNavList.value.filter((item2: TabNavItem) => !equalTabNavRoute(item2.route, item.route, item.menu.tabNavType))
    store.commit('global/setHeadTabNavList', [
        ...navList
    ]);

    if(isRouterPush!==false) {
        router.push(isRouterPush.route)
    }

}

// 關閉TabNav所有
const closeTabNavAll = (): void => {
    // 首頁
    const homeRoute: TabNavItem = tabNavList.value[0];

    // 有關閉回調的無法關閉
    let navList: TabNavItem[] = tabNavList.value.filter((item: TabNavItem) => item.menu.tabNavCloseBefore && typeof item.menu.tabNavCloseBefore === 'function')
    store.commit('global/setHeadTabNavList', [
        {
            ...homeRoute
        },
        ...navList
    ]);

    router.push(homeRoute.route)
}

// 關閉TabNav其他
const closeTabNavOther = (): void => {

    // 有關閉回調的和當前打開的和首頁無法關閉
    let navList: TabNavItem[] = tabNavList.value.filter((item: TabNavItem, i: number) => (item.menu.tabNavCloseBefore && typeof item.menu.tabNavCloseBefore === 'function') || equalTabNavRoute(route, item.route, item.menu.tabNavType) || i===0)
    store.commit('global/setHeadTabNavList', [
        ...navList
    ]);
}

// 關閉TabNav左側和右側
const closeTabNavLeftRight = (param: 'left' | 'right'): void => {
    // 獲取當前打開tabNav索引
    const index = tabNavList.value.findIndex(item => equalTabNavRoute(route, item.route, item.menu.tabNavType))

    // 有關閉回調的和當前打開的和首頁和左側或右側無法關閉
    let navList: TabNavItem[] = tabNavList.value.filter((item: TabNavItem, i: number) => (item.menu.tabNavCloseBefore && typeof item.menu.tabNavCloseBefore === 'function') || ( param === 'left' ? i>=index : i<=index ) || i===0);

    store.commit('global/setHeadTabNavList', [
        ...navList
    ]);
}




watch([route, routeItem], ()=> {
    setTabNav()
})

onMounted(()=> {
    setTabNav()
})


// 路由鏈接
const toRoute = (item: TabNavItem, index: number): void => {
    router.push(item.route);
}

// 刷新當前tabNav
const refreshCurrentTabNav = (item: TabNavItem): void => {
    router.replace('/refresh')
}

// 關閉當前tabNav
const closeCurrentTabNav = (item: TabNavItem, index: number): void => {
    if(item.menu.tabNavCloseBefore && typeof item.menu.tabNavCloseBefore === 'function' ) {
        item.menu.tabNavCloseBefore(()=> {
            closeTabNav(item, index);
        })
    } else {
          closeTabNav(item, index);
    }
}

// 更多操作
const handleCommandMore = (command: string): void => {
    switch (command) {
        case 'closeleft':
            closeTabNavLeftRight('left')
            break;
        case 'closeright':
            closeTabNavLeftRight('right')
            break;
        case 'closeother':
            closeTabNavOther()
            break;
        case 'closeall':
            closeTabNavAll()
            break;
        default:
            break;
    }
}


</script>
