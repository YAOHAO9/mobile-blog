import * as React from 'react';
import Icon from './Icon';
import ReduxChatConnect, { ReduxChatProps } from '../redux/ReduxChatHelper';
import { View, Text } from 'react-native';
import Colors from '../variables/Colors';

interface Props extends ReduxChatProps {
  name: string;
  size: number;
  color: string;
}

@ReduxChatConnect
export default class ChatTabIcon extends React.Component<Props> {


  public renderBadge() {
    if (this.props.chat.allUnreadMsgCount === 0) {
      return undefined;
    }
    return <View style={{
      backgroundColor: Colors.warning,
      height: 16,
      minWidth: 16,
      borderRadius: 8,
      position: 'absolute',
      top: 0,
      left: 16,
      paddingHorizontal: 4,
      zIndex: 1
    }} >
      <Text style={{
        textAlign: 'center',
        color: Colors.white,
        lineHeight: 16
      }}>{this.props.chat.allUnreadMsgCount}</Text>
    </View>;
  }

  public render() {
    return (
      <View >
        {this.renderBadge()}
        <Icon
          name={this.props.name}
          size={this.props.size}
          color={this.props.color}
        />
      </View>
    );
  }
}