import * as React from 'react';
import { View, FlexStyle } from 'react-native';


export default class Col extends React.Component<FlexStyle> {
  public constructor(props: FlexStyle) {
    super(props);
  }

  public render() {
    return (
      <View
        style={Object.assign(
          { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' },
          this.props
        )}
      >
        {this.props.children}
      </View>
    );
  }
}
