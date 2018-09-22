import * as React from 'react';
import { FlexStyle } from 'react-native';
import { Text } from 'react-native-elements';
import Row from '../components/layout/Row';


export default class Chat extends React.Component<FlexStyle> {
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
