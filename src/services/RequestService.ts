import Axios, { AxiosRequestConfig } from 'axios';
import Config from '../configs/config';


export const getRequest = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await Axios.get(Config.serverUrl + url, config);
  return response.data.data;
};

export const putRequest = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await Axios.put(Config.serverUrl + url, data, config);
  return response.data.data;
};


