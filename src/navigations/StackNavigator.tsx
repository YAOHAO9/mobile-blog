import {
  createStackNavigator,
} from 'react-navigation';

import HomeScreen from '../components/HomeScreen'
import Tab from './TabNavigator';

const App = createStackNavigator({
  Tab: {
    screen: Tab,
    navigationOptions() {
      return { title: "Tab" }
    }
  },
  Home: {
    screen: HomeScreen,
    navigationOptions() {
      return { title: "Home" }
    }
  },
});

export default App
