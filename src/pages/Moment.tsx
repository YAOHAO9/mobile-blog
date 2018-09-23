import * as React from 'react';
import { getRequest } from '../services/RequestService';
import Moment from '../models/Moment.model';
import { Image, View, ScrollView, Text, StyleSheet } from 'react-native';
import Config from '../configs/config';
import Avatar from '../components/Avatar';
import Row from '../components/layout/Row';
import Wrap from '../components/layout/Wrap';
import Col from '../components/layout/Col';
import Colors from '../variables/Colors';
import Icon from '../components/Icon';
import Square from '../components/layout/Square';

interface State {
  moments: Moment[],
}

export default class MomentPage extends React.Component<null, State> {

  public constructor(props) {
    super(props);
    this.state = { moments: [] }
  }

  public componentWillMount() {
    this.getMoments();
  }

  public render() {
    return (
      <ScrollView>
        {
          this.state.moments.map(moment => {
            return (
              <View key={moment.id} style={{ borderRadius: 6, flex: 1, backgroundColor: '#fff', marginHorizontal: 5, marginVertical: 4, paddingBottom: 10 }}>
                <Row alignItems={undefined}>
                  <Wrap margin={3}>
                    <Avatar></Avatar>
                  </Wrap>
                  <Col>
                    <Row>
                      <Col alignItems={undefined}>
                        <Text style={styles.name}>{moment.user.name}</Text>
                        <Text style={styles.date}>{moment.createdAt}</Text>
                      </Col>
                      <Wrap width={36} margin={3} alignItems={'center'}>
                        <Icon
                          name="chevron-down"
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
                <Wrap paddingHorizontal={30}>
                  {this.getMomentImageGrid(moment)}
                </Wrap>
              </View>
            )
          })
        }
      </ScrollView>
    );
  }

  public async getMoments() {
    const moments: Moment[] = await getRequest('/api/moment?sort=-createdAt&count=30&offset=0')
    moments.forEach(moment => {
      moment.content = moment.content.replace(/<br\/>/g, '\n').replace(/<.*?>/g, '');
    })
    this.setState({ moments })
  }

  public getMomentImageGrid(moment) {
    let sumOfColumn = 1;
    if (moment.images.length > 9) {
      sumOfColumn = 4
    } else if (moment.images.length > 4) {
      sumOfColumn = 3
    } else if (moment.images.length > 1) {
      sumOfColumn = 2
    } else if (moment.images.length == 1) {
      sumOfColumn = 1
    }
    let imageRows = [];
    for (var i = 0; i <= (moment.images.length - 1) / sumOfColumn; i++) {
      var row = [];
      for (
        var j = i * sumOfColumn;
        j < (i + 1) * sumOfColumn && j < moment.images.length;
        j++
      ) {
        row.push(moment.images[j]);
      }
      imageRows.push(row);
    }
    return imageRows.map((row) => {
      return (
        <Row key={row}>
          {
            row.map(column => {
              return (
                <Square
                  key={column}
                  paddingPercent={2}
                >
                  <Square
                    borderRadiusPercent={5}
                  >
                    <Image

                      style={{ flex: 1 }}
                      source={{ uri: Config.serverUrl + '/api/archive/' + column }}
                    />
                  </Square>
                </Square>
              )
            })
          }
        </Row>
      )
    })
  }
}

const styles = StyleSheet.create({
  name: {
    color: Colors.black,
    fontSize: 14
  },
  date: {
    color: Colors.gray,
    fontSize: 12
  }
});
