/** @format */

import { AppRegistry } from 'react-native';
import RootNavigator from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => RootNavigator);
