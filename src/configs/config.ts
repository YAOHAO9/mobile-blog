import { development } from './development';
import { production } from './production';

export interface ConfigInterface {
  serverUrl: string;
}

const envConfig = __DEV__ ? development : production;

const Config: ConfigInterface = envConfig;
export default Config;
