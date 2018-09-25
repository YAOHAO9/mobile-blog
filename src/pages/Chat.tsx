import * as React from 'react';
import { Text } from 'react-native';
import Col from '../components/layout/Col';
import Page from '../components/layout/Page';


interface Props {
  navigation: any;
}

export default class ChatPage extends React.Component<Props> {

  public constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <Page navigation={this.props.navigation} customHeader={true}>
        <Col justifyContent={undefined} alignItems={undefined}>
          <Text>Chat</Text>
          <Text>Chat</Text>
          <Text>Chat</Text>
          <Text>Chat</Text>
          <Text>Chat</Text>
        </Col>
      </Page>
    );
  }
}
