import * as React from 'react';
import { Image } from 'react-native';
import Config from '../configs/config';
import Archive from '../models/Archive.model';
import { CachedImage } from 'react-native-img-cache';

interface Props {
  archive?: Partial<Archive>;
  width?: number;
  height?: number;
  borderRadius?: number;
  uri?: string;
}

interface State {
  width?: number;
  height?: number;
  borderRadius?: number;
}

export default class Avatar extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      width: props.width || 36,
      height: props.height || 36,
      borderRadius: props.borderRadius || 18
    };
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({
      width: nextProps.width || this.state.width,
      height: nextProps.height || this.state.height,
      borderRadius: nextProps.borderRadius || this.state.borderRadius
    });
  }

  public render() {
    const archive = this.props.archive;
    if ((!archive || !archive.id) && !this.props.uri) {
      return (
        <Image
          style={{
            width: this.state.width,
            height: this.state.height,
            borderRadius: this.state.borderRadius
          }}
          source={require('../assets/images/widget_dface.png')}
        />
      );
    }
    return (
      <CachedImage
        style={{
          width: this.state.width,
          height: this.state.height,
          borderRadius: this.state.borderRadius
        }}
        source={{ uri: this.props.uri || `${Config.serverUrl}/api/archive/${archive.id}` }}
      />
    );
  }
}
