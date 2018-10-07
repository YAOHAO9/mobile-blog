import Axios, { AxiosRequestConfig } from 'axios';
import Config from '../configs/config';
import { Alert } from 'react-native';


export const getRequest = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await Axios.get(Config.serverUrl + url, config);
    return response.data.data;
  } catch (e) {
    if (e.response) {
      Alert.alert(e.response.data.error.message);
    } else {
      Alert.alert(e.message);
    }
    throw e;
  }
};

export const putRequest = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await Axios.put(Config.serverUrl + url, data, config);
    return response.data.data;
  } catch (e) {
    if (e.response) {
      Alert.alert(e.response.data.error.message);
    } else {
      Alert.alert(e.message);
    }
    throw e;
  }
};

export const postRequest = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await Axios.post(Config.serverUrl + url, data, config);
    return response.data.data;
  } catch (e) {
    if (e.response) {
      Alert.alert(e.response.data.error.message);
    } else {
      Alert.alert(e.message);
    }
    throw e;
  }
};