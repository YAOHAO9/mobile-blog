import * as React from 'react';
import { FlexStyle, Text } from 'react-native';
import Row from '../components/layout/Row';


export default class ChatPage extends React.Component<FlexStyle> {
  static navigationOptions = {
    title: 'Home',
  };
  public constructor(props: FlexStyle) {
    super(props);
  }

  public render() {
    return (
      <Row >
        <Text>Chat</Text>
      </Row>
    );
  }
}
