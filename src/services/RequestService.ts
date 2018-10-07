import Axios, { AxiosRequestConfig } from 'axios';
import Config from '../configs/config';


export const getRequest = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {

  try {
    if (url.includes('?')) {
      url = `${url}&t=${new Date().getTime()}`;
    } else {
      url = `${url}?t=${new Date().getTime()}`;
    }
    const response = await Axios.get(Config.serverUrl + url, config);
    return response.data.data;
  } catch (e) {
    if (!e.response) {

    }
    return null;
  }
};

export const putRequest = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await Axios.put(Config.serverUrl + url, data, config);
    return response.data.data;
  } catch (e) {

    if (!e.response) {

    }
  }
};

export const postRequest = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await Axios.post(Config.serverUrl + url, data, config);
    return response.data.data;
  } catch (e) {
    if (!e.response) {

    }
  }
};