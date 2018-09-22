import * as React from 'react';
import {
  createBottomTabNavigator
} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from '../pages/Moment';
import Blog from '../pages/Blog';
import Chat from '../pages/Chat';

const Tab = createBottomTabNavigator({
  Moment: {
    screen: Moment,
    navigationOptions() {
      return {
        title: "Moment",
        tabBarIcon({ tintColor }) {
          return <Icon
            name="alien"
            size={25}
            color={tintColor}
          />;
        }
      }
    }
  },
  Blog: {
    screen: Blog,
    navigationOptions() {
      return {
        title: "Blog",
        tabBarIcon({ tintColor }) {
          return <Icon
            name={'book-open-variant'}
            size={25}
            color={tintColor}
          />;
        }
      }
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions() {
      return {
        title: "Chat",
        tabBarIcon({ tintColor }) {
          return <Icon
            name={'forum-outline'}
            size={25}
            color={tintColor}
          />;
        }
      }
    }
  },
});

export default Tab
