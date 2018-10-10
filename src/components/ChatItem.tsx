import * as React from 'react';
import Row from './layout/Row';
import Col from './layout/Col';
import { Text, View, StyleSheet } from 'react-native';
import Wrap from './layout/Wrap';
import Avatar from './Avatar';
import Chat from '../models/Chat.model';
import ReduxUserConnect, { ReduxUserProps } from '../redux/ReduxUserHelper';
import { toCaption, fromatChatDate } from '../services/ToolService';
import AutoHeightImage from './AutoHeightImage';
import AutoWidthText from './AutoWidthText';
import Colors from '../variables/Colors';

interface Props extends ReduxUserProps {
  chat: Chat;
  lastChat: Chat;
}

@ReduxUserConnect
export default class ChatItem extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  }

  public isSelf() {
    return this.props.chat.sender.id === this.props.user.id;
  }

  public getStyle = (styleName: string) => {
    const isSelf = this.isSelf();
    const commonStyle = styles[styleName];
    styleName = toCaption(styleName);
    const differentStyle = isSelf ? styles[`self${styleName}`] : styles[`else${styleName}`];
    return [commonStyle, differentStyle];
  }

  public renderTextContent(chat: Chat) {
    if (chat.type !== 'text')
      return undefined;
    return (
      <View>
        <AutoWidthText
          text={chat.content}
          style={this.getStyle('text')}>
        </AutoWidthText>
        <View style={this.getStyle('chevron')}></View>
      </View>
    );
  }

  public renderDate(chat: Chat, lastChat: Chat) {
    const chatCreatedAt = new Date(chat.createdAt).getTime();
    if (lastChat && chatCreatedAt - new Date(lastChat.createdAt).getTime() <= 1000 * 60) {
      return undefined;
    }

    return (
      <View>
        <AutoWidthText
          style={styles.date}
          text={fromatChatDate(chatCreatedAt)}
          center={true}
        >
        </AutoWidthText>
      </View>);
  }

  public renderImageContent(chat: Chat) {
    if (chat.type !== 'image')
      return undefined;
    return (
      <View style={styles.imageParent}>
        <AutoHeightImage archive={{ id: +chat.img }}></AutoHeightImage>
      </View>
    );
  }

  public render() {
    const chat = this.props.chat;
    return (
      <Col alignItems={'center'}>
        {this.renderDate(chat, this.props.lastChat)}
        <Row flex={undefined} alignItems={undefined} marginHorizontal={10} marginVertical={5}>
          {!this.isSelf() && <Avatar archive={{ id: chat.sender.avator }}></Avatar>}
          <Col>
            <Text style={this.getStyle('name')}>{chat.sender.name}</Text>
            <Wrap marginTop={5} marginHorizontal={10}>
              {this.renderTextContent(chat)}
              {this.renderImageContent(chat)}
            </Wrap>
          </Col>
          {this.isSelf() && <Avatar archive={{ id: chat.sender.avator }}></Avatar>}
        </Row>
      </Col>
    );
  }
}


const styles = StyleSheet.create({
  imageParent: {
    borderRadius: 10, overflow: 'hidden'
  },
  date: {
    height: 20,
    backgroundColor: Colors.slightGray,
    paddingHorizontal: 10,
    lineHeight: 20,
    fontSize: 12
  },
  name: { marginHorizontal: 10 },
  text: {
    fontSize: 12,
    lineHeight: 30,
    paddingHorizontal: 10,
    backgroundColor: '#b2e281',
    borderRadius: 6,
  },
  chevron: {
    height: 10,
    width: 10,
    backgroundColor: '#b2e281',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: 10,
  },
  // self
  selfName: { textAlign: 'right' },
  selfText: {
    right: 0
  },
  selfChevron: {
    right: -4
  },
  // else
  elseName: { textAlign: 'left' },
  elseText: {
    left: 0
  },
  elseChevron: {
    left: -4
  }
});

