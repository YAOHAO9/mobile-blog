import * as React from 'react';
import Page from '../components/layout/Page';
import Wrap from '../components/layout/Wrap';
import Row from '../components/layout/Row';
import Avatar from '../components/Avatar';
import { Text, FlatList, RefreshControl, TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from '../components/Icon';
import Colors from '../variables/Colors';
import User from '../models/User.model';
import { getRequest } from '../services/RequestService';
import Col from '../components/layout/Col';
import Header from '../components/Header';
import { NavigationScreenProp } from 'react-navigation';


interface Props {
  navigation: NavigationScreenProp<null>;
}

interface State {
  users: extendedUser[],
  refreshing: boolean;
  noMore: boolean;
  loadingMore: boolean;
}

class extendedUser extends User {
  latestChatAt: string;
  chatCount: number;
  unreadCount: number;
}

export default class ChatPage extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      users: [],
      refreshing: false,
      noMore: false,
      loadingMore: false,
    }
  }

  public componentWillMount() {
    this.getChatedUserList();
  }

  public render() {
    return (
      <Page navigation={this.props.navigation} customHeader={true}>
        <Header title={"Chat"}></Header>
        <FlatList
          style={{ marginVertical: 4 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.getChatedUserList(true)}
            ></RefreshControl>
          }
          ListHeaderComponent={() => this.renderHeader()}
          data={this.state.users}
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
      return ''
    }
    return this.state.users.map(user => user.id).join(",");
  }

  public renderHeader() {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('AddChatUser', { exclude: this.getExclude() })}>
        <Col marginVertical={4} marginHorizontal={10}>
          <View style={styles.header}>
            <Row>
              <Wrap marginHorizontal={10}>
                <Icon
                  name="account-plus-outline"
                  size={25}
                  color={Colors.gray}
                ></Icon>
              </Wrap>

              <Text style={styles.addUserText}>Add a user who you want to chat with</Text>
            </Row>
          </View>
        </Col>
      </TouchableOpacity>
    )
  }

  public renderUserItem(user: extendedUser) {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatDetail', { userId: user.id })}>
        <Wrap backgroundColor={Colors.white} borderRadius={6} marginTop={2}>
          <Row flex={undefined} justifyContent={undefined}>
            <Wrap margin={5}>
              <Avatar archive={{ id: user.avator }}></Avatar>
            </Wrap>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.chatCount}>{user.chatCount}</Text>
            <Icon
              name="chevron-right"
              size={30}
              color={Colors.lightGray}
            />
          </Row>
        </Wrap>
      </TouchableOpacity>
    )
  }

  public async getChatedUserList(isRefreshing: boolean = false) {
    if ((!isRefreshing && this.state.noMore) || this.state.loadingMore) {
      return
    }
    await this.setState({ loadingMore: true })
    const offset = isRefreshing ? 0 : this.state.users.length
    let users: extendedUser[] = await getRequest(`/api/user/getChatedUserList?sort=-createdAt&count=10&offset=${offset}&exclude=${this.getExclude(isRefreshing)}`)
    const noMore = users.length > 0 ? false : true
    if (!isRefreshing) {
      users = [...this.state.users, ...users]
    }
    this.setState({ users, refreshing: false, noMore, loadingMore: false })
  }
}


const styles = StyleSheet.create({
  header: { backgroundColor: Colors.white, borderRadius: 6, height: 40 },
  addUserText: { color: Colors.black },
  name: { flex: 1 },
  chatCount: {
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    minWidth: 20,
    minHeight: 20,
    lineHeight: 20,
    fontSize: 12,
    textAlign: "center",
    overflow: "hidden"
  }
});