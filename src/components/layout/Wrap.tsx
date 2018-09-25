import * as React from 'react';
import { View, ViewStyle } from 'react-native';

export default class Wrap extends React.Component<ViewStyle> {
  public constructor(props: ViewStyle) {
    super(props);
  }

  public render() {
    return (
      <View style={this.props} >
        {this.props.children}
      </View>
    );
  }
}
