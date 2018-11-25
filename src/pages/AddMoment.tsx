import * as React from 'react';
import Page from '../components/layout/Page';
import Wrap from '../components/layout/Wrap';
import Row from '../components/layout/Row';
import { Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Image } from 'react-native';
import Colors from '../variables/Colors';
import { postRequest } from '../services/RequestService';
import { NavigationScreenProp } from 'react-navigation';
import Col from '../components/layout/Col';
import { selectImage } from '../services/ImageService';

interface Props {
  navigation: NavigationScreenProp<null>;
}

interface State {
  content: string;
  rows: [][];
}
export default class AddMoment extends React.Component<Props, State> {
  images = [{ type: 'addBtn', uri: '', itemIndex: 9 }];

  constructor(props: Props) {
    super(props);
    this.state = {
      content: '',
      rows: []
    };
  }
  componentWillMount() {
    this.updateRows();
  }

  updateRows() {
    let rows = [];
    let rowsCount = Math.ceil(this.images.length / 3);
    if (rowsCount > 3) {
      rowsCount = 3;
    }
    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
      let row = [];
      for (let itemIndex = rowIndex * 3; itemIndex < this.images.length && itemIndex < (rowIndex + 1) * 3; itemIndex++) {
        row.push({ ...this.images[itemIndex], itemIndex });
      }
      rows.push(row);
    }
    this.setState({ rows });
  }

  async selectImage(item) {
    const res = await selectImage({ title: '选择您想分享的图片' });
    if (res.didCancel || res.error || res.customButton) {
      return null;
    }
    res.uri;
    if (item.type === 'addBtn') {
      this.images.splice(this.images.length - 1, 0, { type: 'image', uri: res.uri, itemIndex: this.images.length - 1 });
    } else {
      this.images.splice(item.itemIndex, 1, { type: 'image', uri: res.uri, itemIndex: item.itemIndex });
    }
    this.updateRows();
  }

  deleteImage(item) {
    this.images.splice(item.itemIndex, 1);
    this.images.forEach((item, index) => {
      if (item.type === 'addBtn') {
        return;
      }
      item.itemIndex = index;
    });
    this.updateRows();
  }

  async submit() {
    const formData = new FormData();
    formData.append('content', this.state.content);
    this.images.forEach(item => {
      if (item.type === 'image') {
        formData.append('images', { uri: item.uri, type: 'multipart/form-data', name: 'image.png' });
      }
    });
    await postRequest(`/api/moment/create`, formData);
    this.setState({ content: '' });
    this.props.navigation.navigate('Tab');
  }

  renderImageSelector(item) {
    return (
      <TouchableOpacity
        onPress={() => this.selectImage(item)}
        onLongPress={() => {
          item.type === 'image' && this.deleteImage(item);
        }}
      >
        <Wrap padding={2} >
          {item.type === 'addBtn' && <Image
            key={item.itemIndex}
            style={{ width: 70, height: 70, resizeMode: 'cover' }}
            source={require('../assets/images/add.png')}
          />}
          {item.type === 'image' && <Image
            key={item.itemIndex}
            style={{ width: 70, height: 70, resizeMode: 'cover' }}
            source={{ uri: item.uri }}
          />}
        </Wrap>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <Page navigation={this.props.navigation} customHeader={false}>
        <ScrollView>
          <TextInput
            multiline={true}
            style={styles.textInput}
            underlineColorAndroid='transparent'
            keyboardType={'default'}
            onSubmitEditing={() => this.submit()}
            enablesReturnKeyAutomatically={true}
            value={this.state.content}
            placeholder='请说点什么吧!'
            onChangeText={(text) => this.setState({ content: text })}
          />
          <Wrap marginLeft={10} marginBottom={10}>
            <Col>
              {
                this.state.rows.map((row, index) => {
                  return (
                    <Row justifyContent={'flex-start'} key={index}>
                      {
                        row.map((item) => {
                          return this.renderImageSelector(item);
                        })
                      }
                    </Row>
                  );
                })
              }
            </Col>
          </Wrap>

          <TouchableOpacity
            style={styles.sendTextBtn}
            onPress={() => this.submit()}>
            <Text style={styles.sendTextBtnText}>发送</Text>
          </TouchableOpacity>
        </ScrollView>
      </Page >
    );
  }

}

const styles = StyleSheet.create({
  textInput: {
    marginVertical: 8,
    backgroundColor: Colors.white,
    height: 100,
    borderRadius: 4,
    paddingHorizontal: 15,
    overflow: 'hidden',
  },
  sendTextBtn: {
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 5,
    backgroundColor: Colors.white,
  },
  sendTextBtnText: {
    textAlign: 'center',
    color: Colors.gray,
    lineHeight: 40
  }
});