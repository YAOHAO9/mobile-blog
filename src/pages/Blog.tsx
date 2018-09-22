import * as React from 'react';
import { View, FlexStyle } from 'react-native';
import { Text } from 'react-native-elements';


export default class Blog extends React.Component<FlexStyle> {
  public constructor(props: FlexStyle) {
    super(props);
  }

  public render() {
    return (
      <View >
        <Text>Blog</Text>
      </View>
    );
  }
}
