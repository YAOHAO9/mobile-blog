import * as React from 'react';
import { Text } from 'react-native';
import { getRequest } from '../services/RequestService';
import Page from '../components/layout/Page';
import User from '../models/User.model';
import { NavigationScreenProp } from 'react-navigation';

interface Props {
  navigation: NavigationScreenProp<null>;
}

interface State {
  receiver: User
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
      receiver: new User()
    }
  }

  public componentWillMount() {
    this.getReceiver()
  }

  public async getReceiver() {
    const userId = this.props.navigation.getParam('userId')
    const receiver = await getRequest(`/api/user/${userId}`)
    this.props.navigation.setParams({ title: receiver.name })
    this.setState({ receiver })
  }

  public render() {
    return (
      <Page navigation={this.props.navigation} customHeader={false}>
        <Text>{this.state.receiver.name}</Text>
      </Page>
    );
  }

}
