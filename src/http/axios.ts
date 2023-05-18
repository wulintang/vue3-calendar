/*
 * @Description:
 * @Date: 2023-05-15 10:35:14
 * @Author: didi
 * @LastEditTime: 2023-05-18 14:58:37
 */
import axios from "axios";
import { Toast } from "vant";

declare module "axios" {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>;
  }
}
const service = axios.create({
  method: "get",
  baseURL: import.meta.env.VITE_APP_API,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  timeout: 30000,
});
// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    // Toast.loading({
    //     duration: 0
    // })
    config.headers.token = sessionStorage.getItem("token") || "";
    return config;
  },
  (error) => {
    console.log(error);
  }
);
// 响应拦截器
interface Res {
  state: number;
  result: any;
  msg: string;
}
service.interceptors.response.use(
  (res) => {
    if (res.data.code != "0000") {
      //  Toast((res.data as Res).msg)
      return;
    }
    Toast.clear();
    return res.data as Res;
  },
  (error) => {
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Toast.clear();
    //  Toast(message)
  }
);
const $http = (options: any) => {
  if (!options.data) {
    options.data = {};
  }
  if (options.method === "get") {
    options.params = options.data;
  }
  return service(options);
};
export default $http;
