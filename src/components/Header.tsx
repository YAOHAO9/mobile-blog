import * as React from 'react';
import Row from './layout/Row';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../variables/Colors';
import Avatar from './Avatar';
import ReduxUserConnect, { ReduxUserProps } from '../redux/ReduxUserHelper';
import Icon from './Icon';
import { NavigationScreenProp } from 'react-navigation';

interface Props extends ReduxUserProps {
  left?: any;
  center?: any;
  right?: any;
  title?: string;
  navigation: NavigationScreenProp<null>;
}
@ReduxUserConnect
export default class Header extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <View style={styles.headerWrapper}>
        <Row>
          {this.renderLeft()}
          <View style={{ flex: 1 }}>
            <View style={styles.headerCenter}>
              <Row>
                {this.renderCenter()}
              </Row>
            </View>
          </View>
          {this.renderRight()}
        </Row>
      </View>
    );
  }

  public renderLeft() {
    if (this.props.left) {
      return this.props.left;
    } else {
      return (
        <TouchableOpacity onPress={() => this.props.navigation.push('Profile')}>
          <Avatar archive={{ id: this.props.user.avator }}></Avatar>
        </TouchableOpacity>
      );
    }
  }

  public renderCenter() {
    if (this.props.center) {
      return this.props.center;
    } else {
      return <Text style={styles.headerCenterText}>{this.props.title}</Text>;
    }
  }

  public renderRight() {
    if (this.props.right) {
      return this.props.right;
    } else {
      return (
        <TouchableOpacity onPress={() => this.props.navigation.push('QrcodeScanner')}>
          <View style={styles.headerRightIconParent}>
            <Icon
              name={'qrcode-scan'}
              size={24}
              color={Colors.lightGray}
            />
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  headerWrapper: { height: 48, backgroundColor: Colors.headerBgColor, paddingHorizontal: 10, position: 'relative' },
  headerCenter: { position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, zIndex: 1 },
  headerCenterText: { flex: 1, textAlign: 'center', fontSize: 20, color: Colors.black, alignSelf: 'center' },
  headerRightIconParent: {
    height: 36,
    width: 36,
    padding: 6
  }
});