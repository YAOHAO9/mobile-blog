import * as React from 'react';
import { FlexStyle, Text } from 'react-native';
import Col from '../components/layout/Col';


export default class BlogPage extends React.Component<FlexStyle> {
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
