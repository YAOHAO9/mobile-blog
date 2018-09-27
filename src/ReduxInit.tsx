import React from 'react';
import ReduxUserConnect, { ReduxUserProps } from './redux/ReduxUserHelper';
import { getRequest } from './services/RequestService';
import User from './models/User.model';
import { View } from 'react-native';

@ReduxUserConnect
export default class ReduxInit extends React.Component<ReduxUserProps> {

  public async componentWillMount() {
    const user: User = await getRequest('/api/user/whoami');
    this.props.updateUser(user);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.children}
      </View >
    );
  }
}
