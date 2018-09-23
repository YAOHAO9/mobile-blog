import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import Config from '../configs/config';
import Archive from '../models/Archive.model';

interface Props {
  archive?: Partial<Archive>,
}

export default class Avatar extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const archive = this.props.archive;
    if (!archive) {
      return (
        <Image
          style={styles.avatar}
          source={require('../assets/images/widget_dface.png')}
        />
      );
    }
    return (
      <Image
        style={styles.avatar}
        source={{ uri: `${Config.serverUrl}/api/archive/${archive.id ? archive.id : archive}` }}
      />
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18
  }
});
