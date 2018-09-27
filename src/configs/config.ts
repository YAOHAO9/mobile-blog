
export interface ConfigInterface {
  serverUrl: string;
}

let Config: ConfigInterface = {
  serverUrl: 'http://192.168.3.3:3000'
};

Config = Object.assign(Config, {});
export default Config;
