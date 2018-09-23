import Axios, { AxiosRequestConfig } from "axios";
import Config from "../configs/config";


export const getRequest = async (url: string, config?: AxiosRequestConfig): Promise<any> => {
  const response = await Axios.get(Config.serverUrl + url, config)
  return response.data.data
}

