/**
 * 自定義 request 網路請求工具,基於axios
 * @author LiQingSong
 */
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { notification } from "ant-design-vue";
import router from '@/config/routes';
import settings from '@/config/settings';
import { getToken, setToken } from '@/utils/localToken';

export interface ResponseData {
    code: number;
    data?: any;
    msg?: string;
    token?: string;
}

const customCodeMessage: {[key: number]: string} = {
  10002: '當前用戶登入信息已失效，請重新登入再操作', // 未登陸
};

const serverCodeMessage: {[key: number]: string} = {
  200: '服務器成功返回請求的數據',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: '服務器發生錯誤，請檢查服務器(Internal Server Error)',
  502: '網關錯誤(Bad Gateway)',
  503: '服務不可用，服務器暫時過載或維護(Service Unavailable)',
  504: '網關超時(Gateway Timeout)',
};

/**
 * 異常處理程式
 */
const errorHandler = (error: any) => {
    const { response, message } = error;
    if (message === 'CustomError') {
        // 自定義錯誤
        const { config, data } = response;
        const { url, baseURL} = config;
        const { code, msg } = data;
        const reqUrl = url.split("?")[0].replace(baseURL, '');
        const noVerifyBool = settings.ajaxResponseNoVerifyUrl.includes(reqUrl);
        if (!noVerifyBool) {
            notification.error({
              message: `提示`,
              description: customCodeMessage[code] || msg || 'Error',
            });
      
            if (code === 10002) {
                router.replace('/user/login');
            }
        }
    } else if (message === 'CancelToken') {
        // 取消請求 Token
        // eslint-disable-next-line no-console
        console.log(message);
    } else if (response && response.status) {
        const errorText = serverCodeMessage[response.status] || response.statusText;
        const { status, request } = response;
        notification.error({
            message: `請求錯誤 ${status}: ${request.responseURL}`,
            description: errorText,
        });
    } else if (!response) {
        notification.error({
            description: '您的網路發生異常，無法連接服務器',
            message: '網路異常',
        });
    }

    return Promise.reject(error);
}

/**
 * 配置request請求時的預設參數
 */
const request = axios.create({
    baseURL: (import.meta.env.VITE_APP_APIHOST || '') as string, // url = api url + request url
    withCredentials: true, // 當跨域請求時發送cookie
    timeout: 0 // 請求超時時間,5000(單位毫秒) / 0 不做限製
});

// 全局設定 - post請求頭
// request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

/**
 * 請求前
 * 請求攔截器
 */
request.interceptors.request.use(
    async (config: AxiosRequestConfig & { cType?: boolean }) => {

        // 如果設定了cType 說明是自定義 添加 Content-Type類型 為自定義post 做鋪墊
        if (config['cType']) {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        }

        // 自定義添加token header
        const headerToken = await getToken();
        if (headerToken) {
            config.headers[settings.ajaxHeadersTokenKey] = headerToken;
        }
  
        return config;
    },
    /* error=> {} */ // 已在 export default catch
);

/**
 * 請求後
 * 回響攔截器
 */
request.interceptors.response.use(
    async (response: AxiosResponse) => {

        const res: ResponseData = response.data;
        const { code, token } = res;

        // 自定義狀態碼驗證
        if (code !== 0) {
            return Promise.reject({
                response,
                message: 'CustomError',
            });
        }

        // 重置刷新token
        if (token) {
            await setToken(token);
        }

        return response;
    },
    /* error => {} */ // 已在 export default catch
);

/** 
 * ajax 導出
 * 
 * Method: get
 *     Request Headers
 *         無 - Content-Type
 *     Query String Parameters
 *         name: name
 *         age: age
 * 
 * Method: post
 *     Request Headers
 *         Content-Type:application/json;charset=UTF-8
 *     Request Payload
 *         { name: name, age: age }
 *         Custom config parameters
 *             { cType: true }  Mandatory Settings Content-Type:application/json;charset=UTF-8
 * ......
 */
export default function(config: AxiosRequestConfig): AxiosPromise<any> {
    return request(config).then((response: AxiosResponse) => response.data).catch(error => errorHandler(error));
}
