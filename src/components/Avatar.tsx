import * as React from 'react';
import { StyleSheet } from 'react-native';
import Config from '../configs/config';
import Archive from '../models/Archive.model';
import { CachedImage } from 'react-native-img-cache';

interface Props {
  archive?: Partial<Archive>;
}

export default class Avatar extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const archive = this.props.archive;
    if (!archive || !archive.id) {
      return (
        <CachedImage
          style={styles.avatar}
          source={require('../assets/images/widget_dface.png')}
        />
      );
    }
    return (
      <CachedImage
        style={styles.avatar}
        source={{ uri: `${Config.serverUrl}/api/archive/${archive.id}` }}
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
