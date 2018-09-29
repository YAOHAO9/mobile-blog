import RootNavigator from './navigations/StackNavigator';
import { Provider } from 'react-redux';
import React from 'react';
import store from './redux/Store';
import InitApp from './InitApp';

export default class APP extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <InitApp>
          <RootNavigator />
        </InitApp>
      </Provider>
    );
  }
}
