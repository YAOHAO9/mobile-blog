import {
  createStackNavigator,
} from 'react-navigation';

import HomeScreen from '../components/HomeScreen'
import Tab from './TabNavigator';
import BlogDetail from '../pages/BlogDetail';
import ChatDetail from '../pages/ChatDetail';
import AddChatUser from '../pages/AddChatUser';

const RootNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions() {
        return { title: "Home" }
      }
    },
    Tab: {
      screen: Tab,
      navigationOptions() {
        return { header: null }
      }
    },
    BlogDetail,
    ChatDetail,
    AddChatUser: {
      screen: AddChatUser,
      navigationOptions() {
        return { title: "Add chat user" }
      }
    }
  },
  {
    initialRouteName: 'Tab'
  });

export default RootNavigator
