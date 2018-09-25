import * as React from 'react';
import { Text } from 'react-native';
import { getRequest } from '../services/RequestService';
import Page from '../components/layout/Page';
import Chat from '../models/Chat.model';

interface Props {
  navigation: any;
}

interface State {
}

export default class ChatDetail extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Chat detail"),
    };
  };
  public constructor(props: Props) {
    super(props);
    this.state = {
    }
  }

  public componentWillMount() {
    this.getChatList();
  }

  public render() {
    const userId = this.props.navigation.getParam('userId')
    return (
      <Page navigation={this.props.navigation} customHeader={false}>
        <Text>{userId}</Text>
      </Page>
    );
  }

  public async getChatList() {
    const chatList: Chat = await getRequest(`/api/chat/find?session=${'0-0'}`);
    this.setState({ articleContent: chatList.content })
  }
}
