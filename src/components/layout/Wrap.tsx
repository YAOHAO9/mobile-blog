import * as React from 'react';
import { View, FlexStyle } from 'react-native';

export default class Wrap extends React.Component<FlexStyle> {
  public constructor(props: FlexStyle) {
    super(props);
  }

  public render() {
    return (
      <View style={this.props}>
        {this.props.children}
      </View>
    );
  }
}
