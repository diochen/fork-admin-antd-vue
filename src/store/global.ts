
import { Mutation/* , Action */ } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { TabNavItem, equalTabNavRoute } from '@/utils/routes';
import settings, { Theme, NavMode } from '@/config/settings';
import router from '@/config/routes';
import { RouteLocationRaw } from 'vue-router';

export interface StateType {
  /* 以下是針對所有 Layout 擴展字段 */
  // 左側展開收起
  collapsed: boolean; 
  // 頭部固定開啓
  headFixed: boolean;
  // tab菜單開啓
  tabNavEnable: boolean;
  // 頭部tab導航列錶
  headTabNavList: TabNavItem[];  

  /* 以下是針對 IndexLayout 擴展字段 */
  // 頂部菜單開啓
  topNavEnable: boolean;

  /* 以下是針對 UniversalLayout 擴展字段 */
  // 模闆主題
  theme: Theme;
  // 頭部固定開啓
  navMode: NavMode;
  // 左側側邊固定開啓
  leftSiderFixed: boolean;
}

export interface ModuleType extends StoreModuleType<StateType> {
  state: StateType;
  mutations: {
    changeLayoutCollapsed: Mutation<StateType>;
    setHeadFixed: Mutation<StateType>;
    setTabNavEnable: Mutation<StateType>;
    setHeadTabNavList: Mutation<StateType>;
    closeCurrentHeadTabNav: Mutation<StateType>;
    setTopNavEnable: Mutation<StateType>;
    setTheme: Mutation<StateType>;
    setNavMode: Mutation<StateType>;
    setLeftSiderFixed: Mutation<StateType>;
  };
  actions: {
  };
}

const homeRoute = router.resolve(settings.homeRouteItem.path);

const initState: StateType = {
  collapsed: false,
  headFixed: settings.headFixed,
  tabNavEnable: settings.tabNavEnable,
  headTabNavList: [
    {
      route: homeRoute,
      menu: settings.homeRouteItem
    }
  ],
  topNavEnable: settings.topNavEnable,
  theme: settings.theme,
  navMode: settings.navMode,
  leftSiderFixed: settings.leftSiderFixed,   
};

const StoreModel: ModuleType = {
  namespaced: true,
  name: 'global',
  state: {
    ...initState
  },
  mutations: {
    changeLayoutCollapsed(state, payload) {
      state.collapsed = payload;
    },
    setHeadFixed(state, payload) {
      state.headFixed = payload;
    },
    setTabNavEnable(state, payload) {
      state.tabNavEnable = payload;
    },
    setHeadTabNavList(state, payload) {
      state.headTabNavList = payload;
    },
    /**
     * 關閉當前tabNav，並跳轉自定義路由
     * @param state 
     * @param payload RouteLocationRaw 跳轉路由參數，必須
     */
     closeCurrentHeadTabNav(state, payload: RouteLocationRaw) {
      const navList: TabNavItem[] =  state.headTabNavList.filter((item2: TabNavItem) => !equalTabNavRoute(router.currentRoute.value, item2.route, item2.menu.tabNavType))
      state.headTabNavList = [
        ...navList
      ]

      router.push(payload)
    },
    setTopNavEnable(state, payload) {
      state.topNavEnable = payload;
    },
    setTheme(state, payload) {
      state.theme = payload;
    },
    setNavMode(state, payload) {
      state.navMode = payload;
    },
    setLeftSiderFixed(state, payload) {
      state.leftSiderFixed = payload;
    },
  },
  actions: {}
}



export default StoreModel;
