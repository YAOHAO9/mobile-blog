import * as React from 'react';
import { Text, Alert, TouchableOpacity, View } from 'react-native';
import { QRScannerView } from 'ac-qrcode-rn';
import urlParse from 'url-parse';
import { parse as parseQuery } from 'query-string';
import Modal from 'react-native-modal';
import Icon from '../components/Icon';
import Colors from '../variables/Colors';
import { getRequest } from '../services/RequestService';
import { NavigationScreenProp } from 'react-navigation';
import ReduxUserConnect, { ReduxUserProps } from '../redux/ReduxUserHelper';
import Row from '../components/layout/Row';
import Button from '../components/Button';
import User from '../models/User.model';
import Wrap from '../components/layout/Wrap';
import Page from '../components/layout/Page';

interface Props extends ReduxUserProps {
  navigation: NavigationScreenProp<null>;
}

interface State {
  showQrcodeScanner: boolean;
  qrcodeUser: User;
  status: 'login' | 'synchronize';
  qrcodeQuery: {
    encrypted: string;
    origin: string;
    socketId: string;
  };
}

@ReduxUserConnect
export default class QrcodeScanner extends React.Component<Props, State> {
  public isHandlingQrcodeResult = false;
  public constructor(props: Props) {
    super(props);
    this.state = {
      showQrcodeScanner: true,
      status: 'login',
      qrcodeUser: new User(),
      qrcodeQuery: {
        encrypted: '',
        origin: '',
        socketId: '',
      }
    };
  }

  public showQrcodeScanner() {
    this.isHandlingQrcodeResult = false;
    this.setState({ showQrcodeScanner: true });
  }

  public async barcodeReceived(e) {
    if (this.isHandlingQrcodeResult) {
      return;
    }
    this.isHandlingQrcodeResult = true;
    if (e.type !== 'QR_CODE') {
      Alert.alert('无效的二维码');
      this.isHandlingQrcodeResult = false;
      return;
    }
    let parsed = urlParse(e.data);
    let { origin, encrypted, socketId } = parseQuery(parsed.query);
    if (!origin || !encrypted || !socketId) {
      Alert.alert('无效的二维码');
      this.isHandlingQrcodeResult = false;
      return;
    }
    const loginResult = await getRequest(`/api/mobile/qrcodeLogin?origin=${origin}&encrypted=${encrypted}&socketId=${socketId}`);
    if (loginResult.action === 'successful') {
      this.props.updateUser(loginResult.user);
      await this.setState({ showQrcodeScanner: false });
      this.isHandlingQrcodeResult = false;
      Alert.alert('登录成功');
      this.props.navigation.goBack();
      return;
    } else if (loginResult.action === 'synchronize') {
      const qrcodeUser = await getRequest(`/api/user/encryptedUser?encrypted=${encrypted}`);
      this.setState({ status: 'synchronize', qrcodeUser, showQrcodeScanner: false, qrcodeQuery: { encrypted, origin, socketId } });
      this.isHandlingQrcodeResult = false;
      return;
    }
    Alert.alert(JSON.stringify(loginResult));
    this.isHandlingQrcodeResult = false;
    Alert.alert('无效的二维码');
  }

  public renderCloseModalButton() {
    return (
      <TouchableOpacity
        onPress={() => this.setState({ showQrcodeScanner: false })}
        style={
          {
            zIndex: 99,
            height: 40,
            width: 40,
            position: 'absolute',
            top: 0,
            right: 0,
            padding: 7
          }
        }
      >
        <Icon
          name='close'
          size={26}
          color={Colors.blue}
        >
        </Icon>
      </TouchableOpacity>
    );
  }

  public renderQrcodeLoginButton() {
    if (this.state.status !== 'login') {
      return undefined;
    }
    return (
      <Button text={'扫描二维码并登入'} onPress={() => this.showQrcodeScanner()}></Button>
    );
  }

  public renderSynchronizeButton() {
    if (this.state.status !== 'synchronize') {
      return undefined;
    }
    return (
      <View>
        <Wrap marginBottom={40}>
          <Text>您好，{this.props.user.name}。请选择您要进行的操作</Text>
        </Wrap>
        <Wrap marginVertical={40}>
          <Button text={`同步账号${this.props.user.name}到二维码`} onPress={() => {
            getRequest(`/api/user/synchronizeToPc?socketId=${this.state.qrcodeQuery.socketId}`);
            Alert.alert('同步账号成功');
            this.props.navigation.goBack();
          }}></Button>
        </Wrap>
        <Button text={`使用二维码账号${this.state.qrcodeUser.name}登录`} onPress={async () => {
          debugger;
          let loginResult = await getRequest(`/api/mobile/changeLoginUser?&encrypted=${this.state.qrcodeQuery.encrypted}`);
          debugger;
          Alert.alert('登录成功');
          this.props.updateUser(loginResult.user);
          this.props.navigation.goBack();
        }}></Button>
      </View>
    );
  }

  public render() {
    return (
      <Page navigation={this.props.navigation} customHeader={false}>
        <Row>
          {this.renderQrcodeLoginButton()}
          {this.renderSynchronizeButton()}
          <Modal
            isVisible={this.state.showQrcodeScanner}
            onBackButtonPress={() => this.setState({ showQrcodeScanner: false })}
            onBackdropPress={() => this.setState({ showQrcodeScanner: false })}
            style={{ overflow: 'hidden', borderRadius: 10 }}
          >
            {this.renderCloseModalButton()}
            <QRScannerView
              onScanResultReceived={(e) => this.barcodeReceived(e)}
              renderTopBarView={() => <Text></Text>}
              renderBottomMenuView={() => <Text></Text>}
            />
          </Modal>
        </Row>
      </Page>
    );
  }
}
