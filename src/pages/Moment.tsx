import * as React from 'react';
import { getRequest } from '../services/RequestService';
import Moment from '../models/Moment.model';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { CachedImage, ImageCache } from 'react-native-img-cache';
import Config from '../configs/config';
import Avatar from '../components/Avatar';
import Row from '../components/layout/Row';
import Wrap from '../components/layout/Wrap';
import Col from '../components/layout/Col';
import Colors from '../variables/Colors';
import Icon from '../components/Icon';
import Square from '../components/layout/Square';
import { fromNow } from '../services/ToolService';
import Blank from '../components/layout/Blank';
import Page from '../components/layout/Page';
import Header from '../components/Header';
import { NavigationScreenProp } from 'react-navigation';
import { updateLoadingState } from '../redux/ReduxGlobalSettingHelper';

interface Props {
  navigation: NavigationScreenProp<null>;
}

interface State {
  moments: Moment[];
  refreshing: boolean;
  noMore: boolean;
  loadingMore: boolean;
}

export default class MomentPage extends React.Component<Props, State> {

  public viewabilityConfig = {
    minimumViewTime: 300,
    viewAreaCoveragePercentThreshold: 10,
    waitForInteraction: true,
  };

  public constructor(props: Props) {
    super(props);
    this.state = { moments: [], refreshing: false, noMore: false, loadingMore: false };
  }

  public onViewableItemsChanged = function (info) {
    info.changed.forEach(changedItem => {
      if (!changedItem.isViewable) {
        const moment: Moment = changedItem.item;
        moment.images.forEach(image => {
          ImageCache.get().cancel(Config.serverUrl + '/api/archive/' + image);
        });
      }
    });
  };

  public componentWillMount() {
    this.getMoments();
  }

  public render() {
    return (
      <Page navigation={this.props.navigation} customHeader={true}>
        <Header title={'Moment'} navigation={this.props.navigation}></Header>
        <FlatList
          style={{ marginVertical: 4 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.getMoments(true)}
            ></RefreshControl>
          }
          data={this.state.moments}
          keyExtractor={(item) => item.id + ''}
          renderItem={(data) => this.renderMomentItem(data.item)}
          onEndReached={() => this.getMoments()}
          onEndReachedThreshold={0.3}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
        >
        </FlatList>
      </Page>
    );
  }

  public async getMoments(isRefreshing: boolean = false) {
    try {
      if ((!isRefreshing && this.state.noMore) || this.state.loadingMore) {
        return;
      }
      await updateLoadingState(true);
      await this.setState({ loadingMore: true });
      const offset = isRefreshing ? 0 : this.state.moments.length;
      let moments: Moment[] = await getRequest(`/api/moment?sort=-createdAt&count=10&offset=${offset}`);
      moments.forEach(moment => {
        moment.content = moment.content.replace(/<br\/>/g, '\n').replace(/<.*?>/g, '');
      });
      const noMore = moments.length > 0 ? false : true;
      if (!isRefreshing) {
        moments = [...this.state.moments, ...moments];
      }
      this.setState({ moments, refreshing: false, noMore, loadingMore: false });
    } finally {
      await updateLoadingState(false);
    }
  }

  public renderMomentItem(moment: Moment) {
    return (
      <View key={moment.id} style={styles.itemWrap}>
        <Row alignItems={undefined}>
          <Wrap margin={3}>
            <Avatar archive={{ id: moment.user.avator }}></Avatar>
          </Wrap>
          <Col>
            <Row>
              <Col alignItems={undefined}>
                <Text style={styles.name}>{moment.user.name}</Text>
                <Text style={styles.date}>{fromNow(moment.createdAt)}</Text>
              </Col>
              <Wrap width={36} margin={3} alignItems={'center'}>
                <Icon
                  name='chevron-down'
                  size={36}
                  color={Colors.lightGray}
                ></Icon>
              </Wrap>
            </Row>
            {!!moment.content && <Wrap marginRight={15} alignSelf={'flex-start'}>
              <Text>{moment.content}</Text>
            </Wrap>
            }
          </Col>
        </Row>
        <Row >
          <Blank></Blank>
          <Col flex={5}>
            {this.renderMomentImageGrid(moment)}
          </Col>
          <Blank></Blank>
        </Row>
      </View>
    );
  }

  public renderMomentImageGrid(moment) {
    let sumOfColumn = 1;
    if (moment.images.length > 9) {
      sumOfColumn = 4;
    } else if (moment.images.length > 4) {
      sumOfColumn = 3;
    } else if (moment.images.length > 1) {
      sumOfColumn = 2;
    } else if (moment.images.length === 1) {
      sumOfColumn = 1;
    }
    let imageRows = [];
    for (let i = 0; i <= (moment.images.length - 1) / sumOfColumn; i++) {
      let row = [];
      for (let j = i * sumOfColumn; j < (i + 1) * sumOfColumn; j++) {
        if (j >= moment.images.length) {
          row.push(null);
          continue;
        }
        row.push(moment.images[j]);
      }
      imageRows.push(row);
    }
    const grid = imageRows.map((row) => {
      return (
        <Row key={'row: ' + row} >
          {
            row.map((column, index) => {
              if (!column) {
                return (<Blank key={'column: ' + index}></Blank>);
              }
              return (
                <Square key={column} paddingPercent={2}>
                  <Square borderRadiusPercent={5}>
                    <CachedImage
                      style={{ flex: 1 }}
                      source={{ uri: Config.serverUrl + '/api/archive/' + column }}
                    />
                  </Square>
                </Square>
              );
            })
          }
        </Row>
      );
    });
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('ImageGallery', { images: JSON.stringify(moment.images) })}>
        {grid}
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  itemWrap: { borderRadius: 6, flex: 1, backgroundColor: '#fff', marginHorizontal: 5, marginVertical: 1, paddingBottom: 10 },
  name: {
    color: Colors.black,
    fontSize: 14
  },
  date: {
    color: Colors.gray,
    fontSize: 12
  }
});
