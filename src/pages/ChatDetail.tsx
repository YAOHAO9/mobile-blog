import * as React from 'react';
import { getRequest } from '../services/RequestService';
import Page from '../components/layout/Page';
import User from '../models/User.model';
import { NavigationScreenProp } from 'react-navigation';
import ChatItem from '../components/ChatItem';
import { FlatList, RefreshControl } from 'react-native';
import Chat from '../models/Chat.model';
import ReduxUserConnect, { ReduxUserProps } from '../redux/ReduxUserHelper';
interface Props extends ReduxUserProps {
  navigation: NavigationScreenProp<null>;
}

interface State {
  receiver: User;
  session: string;
  chats: Chat[];
  refreshing: boolean;
  loading: boolean;
}

@ReduxUserConnect
export default class ChatDetail extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Chat detail'),
    };
  }
  public constructor(props: Props) {
    super(props);
    const selfId = +this.props.user.id || 253;
    const receiverId = +this.props.navigation.getParam('userId', 91);
    this.state = {
      receiver: new User(),
      session: selfId < receiverId ? (`${selfId}-${receiverId}`) : (`${receiverId}-${selfId}`),
      chats: [],
      refreshing: false,
      loading: false
    };
  }

  public componentWillMount() {
    this.getReceiver();
    this.getChats();
  }

  public async getReceiver() {
    const receiverId = this.props.navigation.getParam('userId', 91);
    const receiver = await getRequest(`/api/user/${receiverId}`);
    this.props.navigation.setParams({ title: receiver.name });
    this.setState({ receiver });
  }

  public async getChats() {
    if (this.state.loading) {
      return;
    }
    await this.setState({ loading: true });
    const offset = this.state.chats.length;
    let chats: Chat[] = await getRequest(`/api/chat/find?sort=-createdAt&count=10&offset=${offset}&session=${this.state.session}`);
    chats = [...chats, ...this.state.chats];
    this.setState({ chats, refreshing: false, loading: false });
  }

  public render() {
    return (
      <Page navigation={this.props.navigation} customHeader={false}>
        <FlatList
          style={{ marginVertical: 4 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.getChats()}
            ></RefreshControl>
          }
          data={this.state.chats}
          keyExtractor={(item) => item.id + ''}
          renderItem={(data) => <ChatItem chat={data.item}></ChatItem>}
        >
        </FlatList>
      </Page>
    );
  }
}


