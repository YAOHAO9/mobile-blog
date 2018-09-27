import * as React from 'react';
import Row from './layout/Row';
import { View, Text } from 'react-native';
import Colors from '../variables/Colors';
import Avatar from './Avatar';
import ReduxUserConnect, { ReduxUserProps } from '../redux/ReduxUserHelper';

interface Props extends ReduxUserProps {
  left?: any;
  center?: any;
  right?: any;
  title?: string;
}
@ReduxUserConnect
export default class Header extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <View style={{ height: 48, backgroundColor: Colors.headerBgColor, paddingHorizontal: 10, position: "relative" }}>
        <Row>
          {this.renderLeft()}
          <View style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0, zIndex: 1 }}>
            <Row>
              {this.renderCenter()}
            </Row>
          </View>
          {this.renderRight()}
        </Row>
      </View>
    )
  }
  public renderLeft() {
    if (this.props.left) {
      return this.props.left
    } else {
      return (<View style={{ flex: 1 }}></View>)
    }
  }
  public renderCenter() {
    if (this.props.center) {
      return this.props.center
    } else {
      return <Text style={{ flex: 1, textAlign: "center", fontSize: 20, color: Colors.black, alignSelf: "center" }}>{this.props.title}</Text>
    }
  }

  public renderRight() {
    if (this.props.right) {
      return this.props.right
    } else {
      return (<Avatar archive={{ id: this.props.user.avator }}></Avatar>)
    }
  }
}
