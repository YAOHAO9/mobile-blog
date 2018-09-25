import {
  createStackNavigator,
} from 'react-navigation';

import HomeScreen from '../components/HomeScreen'
import Tab from './TabNavigator';
import BlogDetail from '../pages/BlogDetail';

const App = createStackNavigator(
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
        return { title: "Tab", header: null }
      }
    },
    BlogDetail: {
      screen: BlogDetail
    },
  },
  {
    initialRouteName: 'Tab'
  });

export default App
