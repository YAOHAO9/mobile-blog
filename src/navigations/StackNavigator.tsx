import {
  createStackNavigator, NavigationStackScreenOptions,
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
      navigationOptions(): NavigationStackScreenOptions {
        return {
          title: "Add chat user",
          headerBackTitle: null,
        }
      }
    }
  },
  {
    initialRouteName: 'Tab'
  });

export default RootNavigator
