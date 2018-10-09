import * as React from 'react';
import { Text, Alert } from 'react-native';
import { QRScannerView } from 'ac-qrcode-rn';
import Col from '../components/layout/Col';
export default class QrcodeScanner extends React.Component<null> {
  public constructor(props: null) {
    super(props);
  }

  barcodeReceived(e) {
    if (e.type !== 'QR_CODE') {
      Alert.alert('无效的二维码');
    }
    Alert.alert(e.data);
  }

  public render() {
    return (
      <Col>
        < QRScannerView
          onScanResultReceived={this.barcodeReceived.bind(this)}

          renderTopBarView={() => <Text></Text>}

          renderBottomMenuView={() => <Text></Text>}
        />
      </Col>
    );
  }
}
