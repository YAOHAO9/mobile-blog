import * as React from 'react';
import { getRequest, putRequest } from '../services/RequestService';
import Page from '../components/layout/Page';
import User from '../models/User.model';
import { NavigationScreenProp } from 'react-navigation';
import ChatItem from '../components/ChatItem';
import { FlatList, RefreshControl, TextInput, KeyboardAvoidingView, Keyboard, TouchableOpacity, Text } from 'react-native';
import Chat from '../models/Chat.model';
import { ReduxUserProps, mapUserStateToProps, mapUserDispatchToProps } from '../redux/ReduxUserHelper';
import { ReduxChatProps, mapChatStateToProps, mapChatDispatchToProps } from '../redux/ReduxChatHelper';
import { ReduxConnect, combineMapStateToProps, combineMapDispatchToProps } from '../redux/Store';
import Row from '../components/layout/Row';
import Colors from '../variables/Colors';
import SocketService from '../services/SocketService';
interface Props extends ReduxUserProps, ReduxChatProps {
  navigation: NavigationScreenProp<null>;
}

interface State {
  selfId: number;
  receiverId: number;
  receiver: User;
  session: string;
  refreshing: boolean;
  loading: boolean;
  sendMsg: string;
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
    const selfId = +this.props.user.id;
    const receiverId = +this.props.navigation.getParam('userId');
    this.state = {
      selfId,
      receiverId,
      receiver: new User(),
      session: selfId < receiverId ? (`${selfId}-${receiverId}`) : (`${receiverId}-${selfId}`),
      refreshing: false,
      loading: false,
      sendMsg: 'HAHAHH',
    };
  }

  public componentWillMount() {
    this.props.updateChatList([]);
    this.getReceiver();
    this.getChats(true);
  }

  public async getReceiver() {
    const receiverId = this.props.navigation.getParam('userId');
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
            if (!chat.read && chat.session === this.state.session && chat.senderId !== this.state.selfId) {
              putRequest(`/api/chat/read`, { chatId: chat.id });
              chat.read = true;
            }
            return <ChatItem chat={chat} lastChat={data.index === 0 ? null : chatList[data.index - 1]}></ChatItem>;
          }}
        >
        </FlatList>
        <Row flex={undefined} margin={5}>
          <TextInput
            style={{
              flex: 1,
              padding: 0,
              backgroundColor: Colors.white,
              height: 30,
              paddingHorizontal: 15,
              borderRadius: 6,
              overflow: 'hidden',
            }}
            underlineColorAndroid='transparent'
            multiline={true}
            keyboardType={'default'}
            enablesReturnKeyAutomatically={true}
            value={this.state.sendMsg}
            placeholder='Type here to translate!'
            onChangeText={(text) => this.setState({ sendMsg: text })}
          />
          <TouchableOpacity
            onPress={() => {
              SocketService.instance.emit('submit', {
                content: this.state.sendMsg,
                session: this.state.session,
                senderId: this.state.selfId,
                receiverId: this.state.receiverId
              });
              this.setState({ sendMsg: '' });
            }}>
            <Text style={{
              height: 30,
              paddingHorizontal: 15,
              borderRadius: 6,
              overflow: 'hidden',
              marginHorizontal: 5,
              lineHeight: 30,
              backgroundColor: Colors.lightBlue,
            }}>发送</Text>
          </TouchableOpacity>
        </Row>
      </Page>
    );
  }
}


