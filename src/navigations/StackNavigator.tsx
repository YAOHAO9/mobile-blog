import {
  createStackNavigator, NavigationStackScreenOptions,
} from 'react-navigation';

import HomeScreen from '../components/HomeScreen';
import Tab from './TabNavigator';
import BlogDetail from '../pages/BlogDetail';
import ChatDetail from '../pages/ChatDetail';
import AddChatUser from '../pages/AddChatUser';
import QrcodeScanner from '../pages/QrcodeScanner';

const RootNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions() {
        return { title: 'Home' };
      }
    },
    Tab: {
      screen: Tab,
      navigationOptions() {
        return { header: null };
      }
    },
    BlogDetail,
    ChatDetail,
    QrcodeScanner: {
      screen: QrcodeScanner,
      navigationOptions() {
        return {
          title: '扫码登入',
          headerBackTitle: null,
        };
      }
    },
    AddChatUser: {
      screen: AddChatUser,
      navigationOptions(): NavigationStackScreenOptions {
        return {
          title: '选择您想要聊天的用户',
          headerBackTitle: null,
        };
      }
    }
  },
  {
    initialRouteName: 'Tab'
  });

export default RootNavigator;
