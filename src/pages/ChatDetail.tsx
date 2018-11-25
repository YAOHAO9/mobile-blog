import * as React from 'react';
import { getRequest, putRequest, postRequest } from '../services/RequestService';
import Page from '../components/layout/Page';
import User from '../models/User.model';
import { NavigationScreenProp } from 'react-navigation';
import ChatItem from '../components/ChatItem';
import { FlatList, RefreshControl, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import Chat from '../models/Chat.model';
import { ReduxUserProps, mapUserStateToProps, mapUserDispatchToProps } from '../redux/ReduxUserHelper';
import { ReduxChatProps, mapChatStateToProps, mapChatDispatchToProps } from '../redux/ReduxChatHelper';
import { ReduxConnect, combineMapStateToProps, combineMapDispatchToProps } from '../redux/Store';
import Row from '../components/layout/Row';
import Colors from '../variables/Colors';
import SocketService from '../services/SocketService';
import Icon from '../components/Icon';
import Wrap from '../components/layout/Wrap';
import { selectImage } from '../services/ImageService';


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
  chatList: Chat[];
}


@ReduxConnect(
  combineMapStateToProps([mapUserStateToProps, mapChatStateToProps]),
  combineMapDispatchToProps([mapUserDispatchToProps, mapChatDispatchToProps])
)
export default class ChatDetail extends React.Component<Props, State> {
  public flatList: FlatList<Chat>;
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', '聊天'),
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
      sendMsg: '',
      chatList: []
    };
  }

  public componentDidMount() {
    setTimeout(() => {
      if (this.flatList) {
        this.flatList.scrollToEnd();
      }
    }, 1000);
  }

  public componentWillMount() {
    this.getReceiver();
    this.getChats(true);
    SocketService.instance.registerUpdateListener((chat: Chat) => {
      let { receiverId } = this.state;
      if (receiverId !== chat.senderId && receiverId !== chat.receiverId) {
        return;
      }
      this.setState({ chatList: [...this.state.chatList, chat] });
      setTimeout(() => {
        if (this.flatList) {
          this.flatList.scrollToEnd();
        }
      }, 200);
    });
  }

  public componentWillUnmount() {
    SocketService.instance.registerUpdateListener(null);
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
    const offset = init ? 0 : this.state.chatList.length;
    let chats: Chat[] = await getRequest(`/api/chat/find?sort=-createdAt&count=10&offset=${offset}&session=${this.state.session}`);
    if (!init) {
      chats = [...chats, ...this.state.chatList];
    }
    this.setState({ chatList: chats });
    this.setState({ refreshing: false, loading: false });
  }

  public submit() {
    if (this.state.sendMsg.trim() === '') {
      Alert.alert('请说些什么吧');
      return;
    }
    SocketService.instance.socket.emit('submit', {
      content: this.state.sendMsg,
      session: this.state.session,
      senderId: this.state.selfId,
      receiverId: this.state.receiverId
    });
    this.setState({ sendMsg: '' });
  }

  public async sendImage() {
    const res = await selectImage({ title: '选择您要发送的图片' });
    if (res.didCancel || res.error || res.customButton) {
      return;
    }
    const formData = new FormData();
    formData.append('session', this.state.session);
    formData.append('senderId', this.state.selfId);
    formData.append('receiverId', this.state.receiverId);
    formData.append('image', { uri: res.uri, type: 'multipart/form-data', name: 'image.png' });
    await postRequest('/api/chat/sendImage', formData);
  }
  public render() {
    const chatList = this.state.chatList;
    return (
      <Page navigation={this.props.navigation} customHeader={false}>
        <FlatList
          ref={(flatList) => {
            this.flatList = flatList;
          }}
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
          <TouchableOpacity
            style={styles.sendImageBtn}
            onPress={() => this.sendImage()}>
            <Wrap paddingVertical={3}>
              <Icon
                name={'file-image'}
                size={24}
                color={Colors.lightGray}
              >
              </Icon>
            </Wrap>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            underlineColorAndroid='transparent'
            keyboardType={'default'}
            onSubmitEditing={() => this.submit()}
            enablesReturnKeyAutomatically={true}
            value={this.state.sendMsg}
            placeholder='请输入您想要发送的文字!'
            onChangeText={(text) => this.setState({ sendMsg: text })}
          />
          <TouchableOpacity
            style={styles.sendTextBtn}
            onPress={() => this.submit()}>
            <Text style={styles.sendTextBtnText}>发送</Text>
          </TouchableOpacity>
        </Row>
      </Page>
    );
  }
}

const styles = StyleSheet.create({
  sendImageBtn: {
    height: 30,
    paddingHorizontal: 15,
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 5,
    backgroundColor: Colors.white,
  },
  textInput: {
    flex: 1,
    padding: 0,
    backgroundColor: Colors.white,
    height: 30,
    paddingHorizontal: 15,
    borderRadius: 6,
    overflow: 'hidden',
  },
  sendTextBtn: {
    height: 30,
    paddingHorizontal: 15,
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 5,
    backgroundColor: Colors.white,
  },
  sendTextBtnText: {
    color: Colors.gray,
    lineHeight: 30
  }
});