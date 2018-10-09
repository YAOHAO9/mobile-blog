import * as React from 'react';
import Page from '../components/layout/Page';
import Wrap from '../components/layout/Wrap';
import Row from '../components/layout/Row';
import Avatar from '../components/Avatar';
import { Text, FlatList, RefreshControl, TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from '../components/Icon';
import Colors from '../variables/Colors';
import { getRequest } from '../services/RequestService';
import Col from '../components/layout/Col';
import Header from '../components/Header';
import { NavigationScreenProp } from 'react-navigation';
import { ReduxConnect, combineMapStateToProps, combineMapDispatchToProps } from '../redux/Store';
import { mapUserStateToProps, mapUserDispatchToProps, ReduxUserProps } from '../redux/ReduxUserHelper';
import { mapChatStateToProps, mapChatDispatchToProps, ReduxChatProps } from '../redux/ReduxChatHelper';
import ChatedUser from '../models/ChatedUser.model';
import SocketService from '../services/SocketService';
import Chat from '../models/Chat.model';
import { updateLoadingState } from '../redux/ReduxGlobalSettingHelper';


interface Props extends ReduxUserProps, ReduxChatProps {
  navigation: NavigationScreenProp<null>;
}

interface State {
  refreshing: boolean;
  noMore: boolean;
  loadingMore: boolean;
  chatedUsers: ChatedUser[];
}


@ReduxConnect(
  combineMapStateToProps([mapUserStateToProps, mapChatStateToProps]),
  combineMapDispatchToProps([mapUserDispatchToProps, mapChatDispatchToProps])
)
export default class ChatPage extends React.Component<Props, State> {
  public willFocusListener;

  public constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
      noMore: false,
      loadingMore: false,
      chatedUsers: []
    };
  }

  public async updateAllUnreadMsgCount() {
    const allUnreadMsgCount = await getRequest('/api/chat/allUnreadMsgCount');
    this.props.updateAllUnreadMsgCount(allUnreadMsgCount);
  }

  public componentWillMount() {
    this.willFocusListener = this.props.navigation.addListener('didFocus',
      () => {
        this.getChatedUserList(true);
        this.updateAllUnreadMsgCount();
        SocketService.instance.registerUpdateListener((chat: Chat) => {
          const chatedUsers = this.state.chatedUsers;
          const chatedUser = chatedUsers.find(chatedUser => {
            if (chatedUser.id === chat.senderId) {
              chatedUser.online = chat.sender.online;
              return true;
            }
            if (chatedUser.id === chat.receiverId) {
              chatedUser.online = chat.receiver.online;
              return true;
            }
            return false;
          });

          if (chatedUser) {
            chatedUser.unreadCount++;
          } else {
            let newChatedUser: Partial<ChatedUser>;
            if (this.props.user.id !== chat.senderId) {
              newChatedUser = chat.sender;
            }
            if (this.props.user.id !== chat.receiverId) {
              newChatedUser = chat.receiver;
            }
            newChatedUser.unreadCount = 1;
            chatedUsers.unshift(newChatedUser as ChatedUser);
          }
          this.props.updateAllUnreadMsgCount(this.props.chat.allUnreadMsgCount + 1);
          this.setState({ chatedUsers });
        });
      }
    );
  }

  public componentWillUnmount() {
    this.willFocusListener && this.willFocusListener.remove();
    SocketService.instance.registerUpdateListener(null);
  }

  public render() {
    return (
      <Page navigation={this.props.navigation} customHeader={true}>
        <Header title={'Chat'} navigation={this.props.navigation}></Header>
        <FlatList
          style={{ marginVertical: 4 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.getChatedUserList(true)}
            ></RefreshControl>
          }
          ListHeaderComponent={() => this.renderHeader()}
          data={this.state.chatedUsers}
          keyExtractor={(item) => item.id + ''}
          renderItem={(data) => this.renderUserItem(data.item)}
          onEndReached={() => this.getChatedUserList()}
          onEndReachedThreshold={0.3}
        >
        </FlatList>
      </Page>
    );
  }

  public getExclude(isRefreshing: boolean = false) {
    if (isRefreshing) {
      return '';
    }
    return this.state.chatedUsers.map(user => user.id).join(',');
  }

  public renderHeader() {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('AddChatUser', { exclude: this.getExclude() })}>
        <Col marginVertical={4} marginHorizontal={10}>
          <View style={styles.header}>
            <Row>
              <Wrap marginHorizontal={10}>
                <Icon
                  name='account-plus-outline'
                  size={25}
                  color={Colors.gray}
                ></Icon>
              </Wrap>

              <Text style={styles.addUserText}>选择您想要聊天的用户</Text>
            </Row>
          </View>
        </Col>
      </TouchableOpacity>
    );
  }

  public renderUserItem(user: ChatedUser) {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatDetail', { userId: user.id })}>
        <Wrap backgroundColor={Colors.white} borderRadius={6} marginTop={2}>
          <Row flex={undefined} justifyContent={undefined}>
            <Wrap margin={5}>
              <Avatar archive={{ id: user.avator }}></Avatar>
            </Wrap>
            <Col>
              <Text>{user.name}</Text>
              <Text style={{ fontSize: 10, color: user.online ? Colors.blue : Colors.lightGray }}>
                {user.online ? '[在线]' : '[离线]'}
              </Text>
            </Col>
            {user.unreadCount !== 0 && <Text style={styles.unreadCount}>{user.unreadCount}</Text>}
            <Icon
              name='chevron-right'
              size={30}
              color={Colors.lightGray}
            />
          </Row>
        </Wrap>
      </TouchableOpacity>
    );
  }

  public async getChatedUserList(isRefreshing: boolean = false) {
    try {
      if ((!isRefreshing && this.state.noMore) || this.state.loadingMore) {
        return;
      }
      await updateLoadingState(true);
      await this.setState({ loadingMore: true });
      let chatedUsers: ChatedUser[] = await getRequest(`/api/user/getChatedUserList?sort=-createdAt&count=10&offset=${0}&exclude=${this.getExclude(isRefreshing)}`);
      const noMore = chatedUsers.length > 0 ? false : true;
      await Promise.all(chatedUsers.map(async (chatedUser) => {
        const unreadCount = await getRequest(`/api/chat/unreadMsgCount/${chatedUser.id}`);
        chatedUser.unreadCount = unreadCount;
      }));
      if (!isRefreshing) {
        chatedUsers = [...this.state.chatedUsers, ...chatedUsers];
      }
      this.setState({ refreshing: false, noMore, loadingMore: false, chatedUsers });
    } finally {
      await updateLoadingState(false);
    }
  }
}


const styles = StyleSheet.create({
  header: { backgroundColor: Colors.white, borderRadius: 6, height: 40 },
  addUserText: { color: Colors.black },
  unreadCount: {
    backgroundColor: Colors.warning,
    borderRadius: 10,
    minWidth: 20,
    minHeight: 20,
    lineHeight: 20,
    fontSize: 12,
    color: Colors.white,
    textAlign: 'center',
    overflow: 'hidden'
  }
});