import * as React from 'react';
import Page from '../components/layout/Page';
import Wrap from '../components/layout/Wrap';
import Row from '../components/layout/Row';
import Avatar from '../components/Avatar';
import { Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../components/Icon';
import Colors from '../variables/Colors';
import User from '../models/User.model';
import { getRequest } from '../services/RequestService';
import { NavigationScreenProp } from 'react-navigation';
import Col from '../components/layout/Col';

interface Props {
  navigation: NavigationScreenProp<null, { title: string, exclude: string }>;
}

interface State {
  users: User[];
  refreshing: boolean;
  noMore: boolean;
  loadingMore: boolean;
}
export default class AddChatUser extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      users: [],
      refreshing: false,
      noMore: false,
      loadingMore: false,
    };
  }

  public componentWillMount() {
    this.getChatedUserList();
  }

  public render() {
    return (
      <Page navigation={this.props.navigation} customHeader={false}>
        <FlatList
          style={{ marginVertical: 4 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.getChatedUserList(true)}
            ></RefreshControl>
          }
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

  public renderUserItem(user: User) {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatDetail', { userId: user.id })}>
        <Wrap backgroundColor={Colors.white} borderRadius={6} marginTop={2}>
          <Row flex={undefined} justifyContent={undefined}>
            <Wrap margin={5}>
              <Avatar archive={{ id: user.avator }}></Avatar>
            </Wrap>
            <Col>
              <Text >{user.name}</Text>
              <Text style={[styles.onlineText, { color: user.online ? Colors.blue : Colors.lightGray }]}>
                {user.online ? '[在线]' : '[离线]'}
              </Text>
            </Col>
            <Icon
              name='chevron-right'
              size={25}
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
    const offset = isRefreshing ? 0 : this.state.users.length;
    const exclude = this.props.navigation.getParam('exclude');
    let users: User[] = await getRequest(`/api/user/getChatUserList?sort=-createdAt&count=10&offset=${offset}&exclude=${exclude}`);
    const noMore = users.length > 0 ? false : true;
    if (!isRefreshing) {
      users = [...this.state.users, ...users];
    }
    this.setState({ users, refreshing: false, noMore, loadingMore: false });
  }
}


const styles = StyleSheet.create({
  onlineText: { fontSize: 10 }
});