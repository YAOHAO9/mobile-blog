import * as React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  paddingPercent?: number;
  borderRadiusPercent?: number;
}

interface State {
  height: number;
  padding?: number;
  borderRadius?: number;
}

export default class Square extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { height: 0, padding: 0, borderRadius: 0 };
  }

  public render() {
    return (
      <View
        style={[styles.square, {
          height: this.state.height,
          padding: this.state.padding,
          borderRadius: this.state.borderRadius,
        }]}
        onLayout={(event) => {
          let { paddingPercent, borderRadiusPercent } = this.props;
          if (!paddingPercent || paddingPercent < 0) {
            paddingPercent = 0;
          }
          if (paddingPercent > 100) {
            paddingPercent = 100;
          }
          if (!borderRadiusPercent || borderRadiusPercent < 0) {
            borderRadiusPercent = 0;
          }
          if (borderRadiusPercent > 100) {
            borderRadiusPercent = 100;
          }

          let width = event.nativeEvent.layout.width;
          const height = width;
          const padding = paddingPercent ? width * paddingPercent / 100 : 0;
          const borderRadius = borderRadiusPercent ? height * borderRadiusPercent / 100 : 0;

          this.setState({
            height,
            padding,
            borderRadius
          });
        }}
      >
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  square: {
    flex: 1,
    overflow: 'hidden'
  }
});