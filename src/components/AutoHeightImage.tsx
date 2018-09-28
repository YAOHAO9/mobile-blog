import * as React from 'react';
import { Image, Alert } from 'react-native';
import Config from '../configs/config';
import Archive from '../models/Archive.model';

interface Props {
  archive: Partial<Archive>;
}
interface State {
  containerHeight: number;
}

export default class AutoHeightImage extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      containerHeight: 30
    };
  }

  public render() {
    const archive = this.props.archive;
    return (
      <Image
        style={{ height: this.state.containerHeight }}
        source={{ uri: `${Config.serverUrl}/api/archive/${archive.id}` }}
        onLayout={(event) => this.updateHeight(event)}
      />
    );
  }

  public updateHeight(event) {
    const containerWidth = event.nativeEvent.layout.width;
    const archive = this.props.archive;
    Image.getSize(`${Config.serverUrl}/api/archive/${archive.id}`, (width, height) => {
      const containerHeight = (height / width) * containerWidth;
      this.setState({ containerHeight });
    }, () => 0);
  }
}

