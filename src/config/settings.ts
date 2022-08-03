import { RoutesDataItem } from "@/utils/routes";

export type Theme = 'dark' | 'light';

export type NavMode = 'inline' | 'horizontal';

/**
 * 站點配置
 * @author LiQingSong
 */
export interface SettingsType {
    /**
     * 站點名稱
     */
    siteTitle: string;

    /**
     * 站點首頁路由
     */
    homeRouteItem: RoutesDataItem;

    /**
     * 站點在地存儲Token 的 Key值
     */
    siteTokenKey: string;
  
    /**
     * Ajax請求頭髮送Token 的 Key值
     */
    ajaxHeadersTokenKey: string;
  
    /**
     * Ajax返回值不參加統一驗證的api地址
     */
    ajaxResponseNoVerifyUrl: string[];

    /**
     * iconfont.cn 項目在線生成的 js 地址
     */
    iconfontUrl: string[];

    /**
     * Layout 頭部固定開啓
     */
     headFixed: boolean;

     /**
      * Layout tab菜單開啓
      */
     tabNavEnable: boolean;
 
     /**
      * IndexLayout 頂部菜單開啓
      */
     topNavEnable: boolean;
 
     /**
      * UniversalLayout 模闆主題
      */
     theme: Theme;
 
     /**
       * UniversalLayout 導航模式
       */
     navMode: NavMode;
 
     /**
      * UniversalLayout 左側側邊固定開啓
      */
     leftSiderFixed: boolean;
}
  
const settings: SettingsType = {
    siteTitle: 'ADMIN-ANTD-VUE',
    homeRouteItem: {
        icon: 'control',
        title: 'index-layout.menu.home.workplace',
        path: '/home/workplace',
        component: ()=> import('@/views/home/index.vue')
    },
    siteTokenKey: 'admin_antd_vue_token',
    ajaxHeadersTokenKey: 'x-token',
    ajaxResponseNoVerifyUrl: [
        '/user/login', // 用戶登入
        '/user/info', // 獲取用戶信息
    ],
    iconfontUrl: [],

    /* 以下是針對所有 Layout 擴展字段 */
    headFixed: true,
    tabNavEnable: true,

    /* 以下是針對 IndexLayout 擴展字段 */
    topNavEnable: true,

    /* 以下是針對 UniversalLayout 擴展字段 */
    theme: 'dark',
    navMode: 'inline',
    leftSiderFixed: true,
};

export default settings;
  