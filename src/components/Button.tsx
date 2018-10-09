import * as React from 'react';
import { StyleSheet, TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import Colors from '../variables/Colors';
import Row from './layout/Row';

interface Props {
  text: string;
  onPress?: (event: GestureResponderEvent) => void;
}

export default class Button extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <TouchableOpacity
        style={styles.bg}
        onPress={(event) => this.props.onPress(event)}>
        <Row>
          <Text >{this.props.text}</Text>
        </Row>
      </TouchableOpacity>);
  }
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 10
  }
});
