import React from 'react';
import { ReduxUserProps, mapUserStateToProps, mapUserDispatchToProps } from './redux/ReduxUserHelper';
import { View } from 'react-native';
import { ReduxConnect, combineMapStateToProps, combineMapDispatchToProps } from './redux/Store';
import { mapChatStateToProps, mapChatDispatchToProps, ReduxChatProps } from './redux/ReduxChatHelper';
import SocketService from './services/SocketService';

@ReduxConnect(
  combineMapStateToProps([mapUserStateToProps, mapChatStateToProps]),
  combineMapDispatchToProps([mapUserDispatchToProps, mapChatDispatchToProps])
)
export default class InitApp extends React.Component<ReduxUserProps & ReduxChatProps> {

  public async componentWillMount() {

    SocketService.instance.connect();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.children}
      </View >
    );
  }
}
