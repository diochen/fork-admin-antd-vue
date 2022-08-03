/**
 * Route utils
 * @author LiQingSong
 */

/**
 * 麵包屑類型
 */
 export interface BreadcrumbType {
  // 標題，路由在菜單、瀏覽器title 或 麵包屑中展示的文字，目前可以使用locales
  title: string;
  // 路由地址或外鏈
  path: string;
}

/**
 * tab導航存儲規則類型
 */
export type TabNavType = 'path' | 'querypath';

import 'vue-router'
declare module 'vue-router' {
  /**
   * 自定義補充擴展 - 路由 - 類型字段
   */
  interface _RouteRecordBase {
      // 菜單中是否隱藏
      hidden?: boolean;
      // 圖示的名稱，顯示在菜單標題前
      icon?: string;
      // 權限控製，頁麵角色(您可以設定多個角色)
      roles?: string[];
      // 標題，路由在菜單、瀏覽器title 或 麵包屑中展示的文字，目前可以使用locales
      title: string;
      /**
       * 麵包屑自定義內容：
       *     1、預設不配置按照路由自動讀取；
       *     2、設定為 false , 按照路由自動讀取並不讀當前自己；
       *     3、配置對應的麵包屑格式如下：
       */
      breadcrumb?: BreadcrumbType[] | false;
      /**
       * 設定tab導航存儲規則類型
       *    1、預設不配置按照path(route.path)規則
       *    2、querypath：path + query (route.path+route.query) 規則
       */
      tabNavType?: TabNavType ;
      /**
       * 設定該字段，則在關閉當前tab頁時，作為關閉前的鈎子函數
       * @param close 關閉回調函數
       */
      tabNavCloseBefore?: (close: ()=>void)=> void;
      /**
        * 左側菜單選中，如果設定路徑，側欄將突出顯示你設定的路徑對應的側欄導航
        *   1、（預設 route.path），此參數是為了滿足特殊頁麵特殊需求，
        *   2、如：詳情頁等選中側欄導航或在模塊A下麵的頁麵，想選模塊B為導航選中狀態
        */
      selectLeftMenu?: string;
      /**
        * 所屬頂級菜單,當頂級菜單存在時，用於選中頂部菜單，與側欄菜單切換
        *   1、三級路由此參數的作用是選中頂級菜單
        *   2、二級路由此參數的作用是所屬某個頂級菜單的下麵，兩個層級的必須同時填寫一緻，如果path設定的是外鏈，此參數必填
        *   3、(預設不設定 path.split('/')[0])，此參數是為了滿足特殊頁麵特殊需求
        */
      belongTopMenu?: string;

      // 所有父元素的path,下標key按照父元素的順序
      parentPath?: string[];
  }
}
import { RouteRecordRaw,  RouteLocationNormalizedLoaded } from 'vue-router';


/**
 * 自定義重命名 - 路由類型
 */
export type RoutesDataItem = RouteRecordRaw;

/**
 * 頭部tab導航類型
 */
export interface TabNavItem {
  route: RouteLocationNormalizedLoaded,
  menu: RoutesDataItem
}

/**
 * 用Routes的path作為key的JsonRoutes
 */
 export interface PathJsonRoutesDataItem {
  [path: string]: RoutesDataItem
}

import { isExternal } from './validate';
import { equalObject } from "./object";

/**
 * 獲取 route
 * @param pathname path
 * @param routesData routes
 */
export const getRouteItem = (pathname: string, routesData: RoutesDataItem[]): RoutesDataItem => {
  let item: RoutesDataItem = { title: '', path: '', redirect: '', roles: [] };
  for (let index = 0, len = routesData.length; index < len; index += 1) {
    const element = routesData[index];
    if (element.path === pathname) {
      item = element;
      break;
    }

    if (element.children) {
      item = getRouteItem(pathname, element.children);
      if (item.path !== '') {
        break;
      }
    }
  }

  return item;
};


/**
 * 獲取 route
 * @param pathname 當前路由path
 * @param jsonRoutesData 經過jsonPathVueRoutes處理，框架的所有路由
 * @returns
 */
 export const getJsonRouteItem = (pathname: string, jsonRoutesData: PathJsonRoutesDataItem): RoutesDataItem => {
  return jsonRoutesData[pathname] || {};
}

/**
 * 根據 hidden 判斷是否有數據子集
 * @param children RoutesDataItem[]
 */
export const hasChildRoute = (children: RoutesDataItem[]): boolean => {
  const showChildren = children.filter(item => {
    if (item.hidden) {
      return false;
    }
    return true;
  });
  if (showChildren.length > 0) {
    return true;
  }
  return false;
};

/**
 * 根據路由 path 格式化 - 獲取 父path
 * @param pathname path
 * @param separator 路由分割符- 預設 /
 */
export const formatRoutePathTheParents = (pathname: string, separator = '/'): string[] => {
  const arr: string[] = [];
  if (!pathname || pathname === '') {
    return arr;
  }

  const pathArr = pathname.split(separator);
  for (let index = 1, len = pathArr.length - 1; index < len; index += 1) {
    arr.push(pathArr.slice(0, index + 1).join(separator));
  }

  return arr;
};

/**
 * 根據父path 設定當前項 path
 * @param pathname path
 * @param parentPath 父path - 預設 /
 * @param headStart 路由起始頭 - 預設 /
 */
export const setRoutePathForParent = (pathname: string, parentPath = '/', headStart = '/'): string => {
  if (isExternal(pathname)) {
    return pathname;
  }

  return pathname.substr(0, headStart.length) === headStart
    ? pathname
    : `${parentPath}/${pathname}`;
};

/**
 * 根據路由 pathname 數組 - 返回對應的 route 數組
 * @param pathname 路由path數組
 * @param jsonRoutesData 經過jsonPathVueRoutes處理，框架的所有路由
 * @returns
 */
 export const getPathsTheRoutes = ( pathname: string[], jsonRoutesData: PathJsonRoutesDataItem): RoutesDataItem[] => {
  const routeItem: RoutesDataItem[] = [];

  for (let index = 0, len = pathname.length; index < len; index += 1) {
    const element = pathname[index];
    const item = getJsonRouteItem(element,jsonRoutesData);
    if (item.path !== '') {
      routeItem.push(item);
    }
  }

  return routeItem;
};


/**
 * 獲取麵包屑對應的 route 數組
 * @param pathname 當前路由path
 * @param jsonRoutesData 經過jsonPathVueRoutes處理，框架的所有路由
 * @returns
 */
 export const getBreadcrumbRoutes = (pathname: string, jsonRoutesData: PathJsonRoutesDataItem): BreadcrumbType[] => {
  const route = getJsonRouteItem(pathname,jsonRoutesData);
  if(!route.path) {
    return [];
  }

  if (!route.breadcrumb) {
    const parentPath = route.parentPath || []
    const routes = getPathsTheRoutes(parentPath, jsonRoutesData);

    return route.breadcrumb === false ? routes : [...routes, route];
  }

  return route.breadcrumb;
};


/**
 * 獲取當前路由選中的側邊欄菜單path
 * @param route route
 */
export const getSelectLeftMenuPath = (route: RoutesDataItem): string => {
  return route.selectLeftMenu || route.path;
};

/**
 * 獲取當前路由對應的頂部菜單path
 * @param route route
 */
export const getRouteBelongTopMenu = (route: RoutesDataItem): string => {
  if (route.belongTopMenu) {
    return route.belongTopMenu;
  }
  return route.parentPath ? (route.parentPath[0] || `/${route.path.split('/')[1]}`) :  `/${route.path.split('/')[1]}`;
};


/**
 * 格式化返回 vue 路由, 主要處理特殊情況
 * @param routesData routes
 * @param parentPath 父path - 預設 /
 * @param headStart 路由起始頭 - 預設 /
 */
export const vueRoutes = (routesData: RoutesDataItem[], parentPath = '/', headStart = '/'): RoutesDataItem[] => {
  return routesData.map(item => {
    const { children, ...other } = item;
    const itemChildren = children || [];
    const newItem: RoutesDataItem = { ...other };
    newItem.path = setRoutePathForParent(newItem.path, parentPath, headStart);
    
    if (item.children) {
      newItem.children = [
        ...vueRoutes(itemChildren, newItem.path, headStart),
      ];
    }

    return newItem;
  });
};


/**
 * 把經過 vueRoutes 處理過的 routes 轉換成用path作為key的json，並統一增加了parentPath
 * @param vueRoutesData 經過 vueRoutes 處理過的 routes
 * @returns PathJsonRoutesDataItem
 */
 export const jsonPathVueRoutes = (vueRoutesData: RoutesDataItem[]): PathJsonRoutesDataItem=> {

  const jsonRoutes: PathJsonRoutesDataItem = {};

  function forRoute(routesData: RoutesDataItem[], parentPath: string[]) {
    const len = routesData.length;
    for (let index = 0; index < len; index++) {
      const item = routesData[index];

      const pPath = (item.parentPath && item.parentPath.length > 0) ? item.parentPath : parentPath;

      const newItem: RoutesDataItem = {
        ...item,
        parentPath: [...pPath]
      };

      jsonRoutes[item.path] = newItem;

      if (item.children) {
        forRoute(item.children,[...pPath, item.path])
      }

    }
  }

  forRoute(vueRoutesData, []);

  return jsonRoutes;
}


/**
 * 批量設定route.meta值
 * @param routesData routes
 */
 export const routesSetMeta = (routesData: RoutesDataItem[]): RoutesDataItem[] => {
  return routesData.map(item => {
    const { children, tabNavType, meta, ...other } = item;    
    const newItem: RoutesDataItem = {
      meta: {
        ...meta,

        // 自定義設定的 meta 值 S

        tabNavType: tabNavType || 'path',  

        // 自定義設定的 meta 值 E
      },
      ...other
     };
    
    if (item.children) {
      const itemChildren = children || [];
      newItem.children = [
        ...routesSetMeta(itemChildren),
      ];
    }

    return newItem;
  });

}


/**
 * 根據 自定義傳入權限名 判斷當前用戶是否有權限
 * @param userRoles 用戶的權限
 * @param roles 自定義權限名
 */
export const hasPermissionRouteRoles = (userRoles: string[], roles?: string | string[]): boolean => {
  if (userRoles.includes('admin')) {
    return true;
  }

  if(typeof roles === 'undefined') {
    return true;
  }

  if (typeof roles === 'string') {
    return userRoles.includes(roles);
  } 

  if(roles instanceof Array && roles.length > 0) {
    return roles.some(role => userRoles.includes(role));
  }

  return false;
};

/**
 * 根據 route.roles 判斷當前用戶是否有權限
 * @param roles 用戶的權限
 * @param route 當前路由
 */
export const hasPermission = (roles: string[], route: RoutesDataItem): boolean => {
  if (roles.includes('admin')) {
    return true;
  }

  if (route.roles) {
    return route.roles.some(role => roles.includes(role));
    //return roles.some(role => route.roles?.includes(role));
  }

  return true;
};

/**
 * 根據用戶權限 獲取 對應權限菜單
 * @param roles 用戶的權限
 * @param routes 框架對應路由
 */
export const getPermissionMenuData = ( roles: string[], routes: RoutesDataItem[]): RoutesDataItem[] => {
  const menu: RoutesDataItem[] = [];
  for (let index = 0, len = routes.length; index < len; index += 1) {
    const element = {...routes[index]};
    if (hasPermission(roles, element)) {
      if (element.children) {
        element.children = getPermissionMenuData(roles, element.children);
      }
      menu.push(element);
    }
  }

  return menu;
};



/**
 * 判斷tabNav，對應的route是否相等
 * @param route1 vue-route
 * @param route2 vue-route
 * @param type 判斷規則
 * @returns 
 */
 export const equalTabNavRoute = (route1: RouteLocationNormalizedLoaded, route2: RouteLocationNormalizedLoaded, type: TabNavType = 'path'): boolean=> {
  let is = false;
  switch (type) {
    case 'querypath': // path + query
      is = equalObject(route1.query,route2.query) && route1.path === route2.path
      break;
    default: // path
      is = route1.path === route2.path
      break;
  }

  return is;
}

