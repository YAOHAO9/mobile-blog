import * as React from 'react';
import Gallery from 'react-native-image-gallery';
import Config from '../configs/config';
import { NavigationScreenProp } from 'react-navigation';
import Page from '../components/layout/Page';

interface Props {
  navigation: NavigationScreenProp<null>;
}

interface State {
  images: any[];
}

export default class ImageGallery extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    const images = JSON.parse(this.props.navigation.getParam('images', '[]'));
    this.state = { images };
  }

  public render() {
    return (
      <Page navigation={this.props.navigation} customHeader={false}>
        <Gallery
          style={{ flex: 1, backgroundColor: 'black' }}
          images={this.state.images.map(image => {
            return { source: { uri: `${Config.serverUrl}/api/archive/${image}` } };
          })}
        />
      </Page>
    );
  }
}