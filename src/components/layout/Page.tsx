import * as React from 'react';
import { StatusBar, StatusBarProps, Platform, View } from 'react-native';
import Wrap from './Wrap';
import Colors from '../../variables/Colors';
import { NavigationScreenProp } from 'react-navigation';

interface Props extends StatusBarProps {
  navigation: NavigationScreenProp<null>;
  customHeader: boolean;
}

export default class Page extends React.Component<Props> {
  public willFocusListener;

  public constructor(props: Props) {
    super(props);
  }

  public componentWillMount() {
    if (Platform.OS !== 'android') {
      return;
    }
    this.willFocusListener = this.props.navigation.addListener('willFocus',
      (_) => {
        if (this.props.customHeader) {
          StatusBar.setTranslucent(true);
        } else {
          StatusBar.setTranslucent(false);
        }
      }
    );
  }

  public componentWillUnmount() {
    this.willFocusListener && this.willFocusListener.remove();
  }

  public renderCustomBar() {
    return (
      <View>
        <StatusBar
          // These are for android to make sure it has the same display with ios.
          translucent={true}
          backgroundColor={Colors.transparent}
          barStyle={this.props.barStyle || 'dark-content'}
        />
        <Wrap backgroundColor={this.props.backgroundColor || Colors.slightWhite} height={StatusBar.currentHeight || 24}></Wrap>
      </View>
    );
  }

  public render() {
    return (
      <Wrap flex={1}>
        {this.props.customHeader && this.renderCustomBar()}
        {this.props.children}
      </Wrap>
    );
  }
}
