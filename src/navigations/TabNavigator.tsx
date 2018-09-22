import {
  createBottomTabNavigator
} from 'react-navigation';

import Moment from '../pages/Moment';
import Blog from '../pages/Blog';
import Chat from '../pages/Chat';

const Tab = createBottomTabNavigator({
  Moment: {
    screen: Moment,
    navigationOptions() {
      return { title: "Moment" }
    }
  },
  Blog: {
    screen: Blog,
    navigationOptions() {
      return { title: "Blog" }
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions() {
      return { title: "Chat" }
    }
  },
});

export default Tab
