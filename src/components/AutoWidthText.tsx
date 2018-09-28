import * as React from 'react';
import { View, Text, StyleProp, TextStyle, StyleSheet } from 'react-native';

interface Props {
  text: string;
  style: StyleProp<TextStyle>;
}
interface State {
  contentHeight: number;
}

export default class AutoWidthText extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      contentHeight: 30
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
      <View style={{ height: this.state.contentHeight }}>
        <Text
          style={[styleSheets.text, ...styles]}
          onLayout={(event) => {
            this.setState({ contentHeight: event.nativeEvent.layout.height });
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