import * as React from 'react';
import { FlexStyle } from 'react-native';
import { Text } from 'react-native-elements';
import Col from '../components/layout/Col';


export default class Blog extends React.Component<FlexStyle> {
  static navigationOptions = {
    title: 'Home',
  };
  public constructor(props: FlexStyle) {
    super(props);
  }

  public render() {
    return (
      <Col >
        <Text>Blog</Text>
      </Col>
    );
  }
}
