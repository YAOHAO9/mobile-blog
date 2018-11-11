import {
  createStackNavigator, NavigationStackScreenOptions,
} from 'react-navigation';

import Tab from './TabNavigator';
import BlogDetail from '../pages/BlogDetail';
import ChatDetail from '../pages/ChatDetail';
import AddChatUser from '../pages/AddChatUser';
import QrcodeScanner from '../pages/QrcodeScanner';
import ImageGallery from '../pages/ImageGallery';
import Profile from '../pages/Profile';

const RootNavigator = createStackNavigator(
  {
    Tab: {
      screen: Tab,
      navigationOptions() {
        return { header: null };
      }
    },
    BlogDetail,
    ChatDetail,
    ImageGallery: {
      screen: ImageGallery,
      navigationOptions() {
        return {
          title: '浏览图片',
          headerBackTitle: null,
        };
      }
    },
    QrcodeScanner: {
      screen: QrcodeScanner,
      navigationOptions() {
        return {
          title: '扫码登入',
          headerBackTitle: null,
        };
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions() {
        return {
          title: '个人简介',
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
