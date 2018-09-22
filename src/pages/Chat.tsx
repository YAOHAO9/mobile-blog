import * as React from 'react';
import { View, FlexStyle } from 'react-native';
import { Text } from 'react-native-elements';


export default class Chat extends React.Component<FlexStyle> {
  public constructor(props: FlexStyle) {
    super(props);
  }

  public render() {
    return (
      <View >
        <Text>Chat</Text>
      </View>
    );
  }
}
