import * as React from 'react';
import { TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import ReduxUserConnect, { ReduxUserProps } from '../redux/ReduxUserHelper';
import Row from '../components/layout/Row';
import Page from '../components/layout/Page';
import Avatar from '../components/Avatar';
import Col from '../components/layout/Col';
import Colors from '../variables/Colors';
import Button from '../components/Button';
import Wrap from '../components/layout/Wrap';
import { postRequest } from '../services/RequestService';
import User from '../models/User.model';
import { selectImage } from '../services/ImageService';

interface Props extends ReduxUserProps {
  navigation: NavigationScreenProp<null>;
}

interface State {
  name: string;
  avator: number;
  uri: string;
}


@ReduxUserConnect
export default class Profile extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      name: props.user.name,
      avator: props.user.avator,
      uri: ''
    };
  }

  public componentWillReceiveProps(nextProps: Readonly<Props>) {
    this.setState({
      name: nextProps.user.name,
      avator: nextProps.user.avator
    });
  }

  public async saveProfile() {
    const formData = new FormData();
    formData.append('name', this.state.name);
    this.state.uri && formData.append('avator', { uri: this.state.uri, type: 'multipart/form-data', name: 'image.png' });
    const user: User = await postRequest(`/api/user/update/${this.props.user.id}`, formData);
    Alert.alert('保存成功');
    this.props.updateUser(user);
    this.setState({ uri: '' });
  }

  public async selectAvator() {
    const res = await selectImage({ title: '选择头像' });
    if (res.didCancel || res.error || res.customButton) {
      return;
    }
    this.setState({ uri: res.uri });
  }


  public render() {
    return (
      <Page navigation={this.props.navigation} customHeader={false}>
        <Wrap height={100}></Wrap>
        <Col flex={undefined} alignItems={'center'}>
          <TouchableOpacity onPress={() => this.selectAvator()}>
            <Avatar
              archive={{ id: this.state.avator }}
              width={100}
              height={100}
              borderRadius={50}
              uri={this.state.uri}
            ></Avatar>
          </TouchableOpacity>
          <Text style={{ fontSize: 14, marginTop: 20, color: Colors.gray }}>点击修改头像</Text>
        </Col>
        <Wrap height={30}></Wrap>
        <Row flex={undefined}>
          <Text style={{ fontSize: 15, paddingLeft: 10, paddingRight: 10 }}>用户名：</Text>
          <TextInput
            style={styles.name}
            underlineColorAndroid='transparent'
            keyboardType={'default'}
            enablesReturnKeyAutomatically={true}
            value={this.state.name}
            placeholder='请输入您的名字'
            onChangeText={(text) => this.setState({ name: text })}
          ></TextInput>
        </Row>
        <Wrap height={30}></Wrap>
        <Button text={'保存'} onPress={() => this.saveProfile()}></Button>
      </Page>

    );
  }
}
const styles = StyleSheet.create({
  label: { fontSize: 15 },
  name: { flex: 1, fontSize: 15 }
});