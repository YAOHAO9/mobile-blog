import RootNavigator from './navigations/StackNavigator';
import { Provider } from 'react-redux';
import React from 'react';
import store from './redux/Store';
import ReduxInit from './ReduxInit';

export default class APP extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ReduxInit>
          <RootNavigator />
        </ReduxInit>
      </Provider>
    );
  }
}
