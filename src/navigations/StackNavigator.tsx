import {
  createStackNavigator,
} from 'react-navigation';

import HomeScreen from '../components/HomeScreen'
import Tab from './TabNavigator';

const App = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions() {
      return { title: "Home" }
    }
  },
  Tab: {
    screen: Tab,
    // navigationOptions() {
    //   return { title: "Tab" }
    // }
  },
});

export default App
