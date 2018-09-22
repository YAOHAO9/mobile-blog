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
        tabBarIcon() {
          return <Icon
            name="alien"
            size={25}
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
        tabBarIcon() {
          return <Icon name={'book-open-variant'} size={25} />;
        }
      }
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions() {
      return {
        title: "Chat",
        tabBarIcon() {
          return <Icon name={'forum-outline'} size={25} />;
        }
      }
    }
  },
});

export default Tab
