import React from 'react';
import { ReduxUserProps, mapUserStateToProps, mapUserDispatchToProps } from './redux/ReduxUserHelper';
import { getRequest } from './services/RequestService';
import User from './models/User.model';
import { View } from 'react-native';
import Config from './configs/config';
import Chat from './models/Chat.model';
import { ReduxConnect, combineMapStateToProps, combineMapDispatchToProps } from './redux/Store';
import { mapChatStateToProps, mapChatDispatchToProps, ReduxChatProps } from './redux/ReduxChatHelper';
import ChatedUser from './models/ChatedUser.model';
import io from 'socket.io-client';

@ReduxConnect(
  combineMapStateToProps([mapUserStateToProps, mapChatStateToProps]),
  combineMapDispatchToProps([mapUserDispatchToProps, mapChatDispatchToProps])
)
export default class InitApp extends React.Component<ReduxUserProps & ReduxChatProps> {

  public async componentWillMount() {
    // get login user
    const loginUser: User = await getRequest('/api/user/whoami');
    this.props.updateUser(loginUser);
    // get allUnreadMsgCount
    const allUnreadMsgCount = await getRequest('/api/chat/allUnreadMsgCount');
    this.props.updateAllUnreadMsgCount(allUnreadMsgCount);
    const socket = io(Config.serverUrl, { path: '/socket.io' });
    socket.on('connect', () => {
      socket.emit('whoami', { userId: loginUser.id, accessOrigin: Config.serverUrl });
    });
    socket.on('update', (chat: Chat) => {
      const chatedUsers = this.props.chat.chatedUsers;
      const chatedUser = chatedUsers.find(chatedUser => {
        return chatedUser.id === chat.senderId || chatedUser.id === chat.receiverId;
      });

      if (chatedUser) {
        chatedUser.unreadCount++;
      } else {
        let newChatedUser: Partial<ChatedUser>;
        if (loginUser.id !== chat.senderId) {
          newChatedUser = chat.sender;
        }
        if (loginUser.id !== chat.receiverId) {
          newChatedUser = chat.receiver;
        }
        newChatedUser.unreadCount = 1;
        chatedUsers.unshift(newChatedUser as ChatedUser);
      }
      this.props.updateAllUnreadMsgCount(this.props.chat.allUnreadMsgCount + 1);
      this.props.updateChatedUsers(chatedUsers);
    });

  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.children}
      </View >
    );
  }
}
