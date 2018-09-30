import * as React from 'react';
import { getRequest, putRequest } from '../services/RequestService';
import Page from '../components/layout/Page';
import User from '../models/User.model';
import { NavigationScreenProp } from 'react-navigation';
import ChatItem from '../components/ChatItem';
import { FlatList, RefreshControl } from 'react-native';
import Chat from '../models/Chat.model';
import { ReduxUserProps, mapUserStateToProps, mapUserDispatchToProps } from '../redux/ReduxUserHelper';
import { ReduxChatProps, mapChatStateToProps, mapChatDispatchToProps } from '../redux/ReduxChatHelper';
import { ReduxConnect, combineMapStateToProps, combineMapDispatchToProps } from '../redux/Store';
interface Props extends ReduxUserProps, ReduxChatProps {
  navigation: NavigationScreenProp<null>;
}

interface State {
  receiver: User;
  session: string;
  refreshing: boolean;
  loading: boolean;
}


@ReduxConnect(
  combineMapStateToProps([mapUserStateToProps, mapChatStateToProps]),
  combineMapDispatchToProps([mapUserDispatchToProps, mapChatDispatchToProps])
)
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
      refreshing: false,
      loading: false
    };
  }

  public componentWillMount() {
    this.getReceiver();
    this.getChats(true);
  }

  public async getReceiver() {
    const receiverId = this.props.navigation.getParam('userId', 91);
    const receiver = await getRequest(`/api/user/${receiverId}`);
    this.props.navigation.setParams({ title: receiver.name });
    this.setState({ receiver });
  }

  public async getChats(init: boolean = false) {
    if (this.state.loading) {
      return;
    }
    await this.setState({ loading: true });
    const offset = init ? 0 : this.props.chat.chatList.length;
    let chats: Chat[] = await getRequest(`/api/chat/find?sort=-createdAt&count=10&offset=${offset}&session=${this.state.session}`);
    if (!init) {
      chats = [...chats, ...this.props.chat.chatList];
    }
    this.props.updateChatList(chats);
    this.setState({ refreshing: false, loading: false });
  }

  public read(chat: Chat) {
    setImmediate(() => {
      putRequest(`/api/chat/read`, { chatId: chat.id });
      this.props.updateAllUnreadMsgCount(this.props.chat.allUnreadMsgCount - 1);
    });
  }

  public render() {
    const chatList = this.props.chat.chatList;
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
          data={chatList}
          keyExtractor={(item) => item.id + ''}
          renderItem={(data) => {
            const chat = data.item;
            if (!chat.read) {
              this.read(chat);
              chat.read = true;
            }
            return <ChatItem chat={chat} lastChat={data.index === 0 ? null : chatList[data.index - 1]}></ChatItem>;
          }}
        >
        </FlatList>
      </Page>
    );
  }
}


