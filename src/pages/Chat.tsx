import * as React from 'react';
import Page from '../components/layout/Page';
import Wrap from '../components/layout/Wrap';
import Row from '../components/layout/Row';
import Avatar from '../components/Avatar';
import { Text, FlatList, RefreshControl, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
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


interface Props extends ReduxUserProps, ReduxChatProps {
  navigation: NavigationScreenProp<null>;
}

interface State {
  refreshing: boolean;
  noMore: boolean;
  loadingMore: boolean;
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
    };
  }

  public componentWillMount() {
    this.willFocusListener = this.props.navigation.addListener('willFocus',
      () => {
        this.getChatedUserList(true);
      }
    );
  }

  public componentWillUnmount() {
    this.willFocusListener && this.willFocusListener.remove();
  }

  public render() {
    return (
      <Page navigation={this.props.navigation} customHeader={true}>
        <Header title={'Chat'}></Header>
        <FlatList
          style={{ marginVertical: 4 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.getChatedUserList(true)}
            ></RefreshControl>
          }
          ListHeaderComponent={() => this.renderHeader()}
          data={this.props.chat.chatedUsers}
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
    return this.props.chat.chatedUsers.map(user => user.id).join(',');
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

              <Text style={styles.addUserText}>Add a user who you want to chat with</Text>
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
            <Text style={styles.name}>{user.name}</Text>
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
    if ((!isRefreshing && this.state.noMore) || this.state.loadingMore) {
      return;
    }
    await this.setState({ loadingMore: true });
    let chatedUsers: ChatedUser[] = await getRequest(`/api/user/getChatedUserList?sort=-createdAt&count=10&offset=${0}&exclude=${this.getExclude(isRefreshing)}`);
    const noMore = chatedUsers.length > 0 ? false : true;
    await Promise.all(chatedUsers.map(async (chatedUser) => {
      const unreadCount = await getRequest(`/api/chat/unreadMsgCount/${chatedUser.id}`);
      chatedUser.unreadCount = unreadCount;
    }));
    if (!isRefreshing) {
      chatedUsers = [...this.props.chat.chatedUsers, ...chatedUsers];
    }
    this.props.updateChatedUsers(chatedUsers);
    this.setState({ refreshing: false, noMore, loadingMore: false });
  }
}


const styles = StyleSheet.create({
  header: { backgroundColor: Colors.white, borderRadius: 6, height: 40 },
  addUserText: { color: Colors.black },
  name: { flex: 1 },
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