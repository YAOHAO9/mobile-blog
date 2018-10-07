import * as React from 'react';
import { View, Text, StyleProp, TextStyle, StyleSheet } from 'react-native';

interface Props {
  text: string;
  style: StyleProp<TextStyle>;
  center?: boolean;
}
interface State {
  contentHeight: number;
  left: number;
  overflow: 'visible' | 'hidden' | 'scroll';
}

export default class AutoWidthText extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      contentHeight: 30,
      left: undefined,
      overflow: 'hidden'
    };
  }

  public render() {
    let styles = [];
    if (this.props.style instanceof Array) {
      styles = this.props.style;
    } else {
      styles = [this.props.style];
    }
    return (
      <View style={{
        height: this.state.contentHeight,
        overflow: this.state.overflow
      }}>
        <Text
          style={[styleSheets.text, ...styles, { left: this.state.left }]}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            this.setState({
              contentHeight: height,
              overflow: 'visible',
              left: this.props.center ? -width / 2 : undefined
            });
          }}
        >
          {this.props.text}
        </Text>
      </View>
    );
  }
}


const styleSheets = StyleSheet.create({
  text: {
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
  }
});