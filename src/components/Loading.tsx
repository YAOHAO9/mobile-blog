import * as React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import Row from './layout/Row';
import Colors from '../variables/Colors';
import ReduxGlobalConnect, { ReduxGlobalSettingProps } from '../redux/ReduxGlobalSettingHelper';

interface Props extends ReduxGlobalSettingProps {
}

@ReduxGlobalConnect
export default class Loading extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    if (!this.props.loading) {
      return null;
    }
    return (
      <View style={styles.loading}>
        <Row>
          <ActivityIndicator color={Colors.blue}></ActivityIndicator>
        </Row>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    zIndex: 99,
    backgroundColor: '#0004',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
});