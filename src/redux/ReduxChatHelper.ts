import { ChatState, updateChatedUsers, updateAllUnreadMsgCount, updateChatList } from './ReduxChat';
import { connect } from 'react-redux';
import ChatedUser from '../models/ChatedUser.model';
import Chat from '../models/Chat.model';

export interface ReduxChatProps {
  // State
  chat?: ChatState;
  // Action
  updateAllUnreadMsgCount?: (allUnreadMsgCount: number) => any;
  updateChatedUsers?: (chatedUsers: ChatedUser[]) => any;
  updateChatList?: (chatList: Chat[]) => any;
}

// State => Props
export const mapChatStateToProps = (state, /* ownProps */) => ({
  chat: state.chat
});

// Dispatch => Props
export const mapChatDispatchToProps = (dispatch, /* ownProps */) => ({
  updateAllUnreadMsgCount: (allUnreadMsgCount: number) => dispatch(updateAllUnreadMsgCount(allUnreadMsgCount)),
  updateChatedUsers: (chatedUsers: ChatedUser[]) => dispatch(updateChatedUsers(chatedUsers)),
  updateChatList: (chatList: Chat[]) => dispatch(updateChatList(chatList)),
});

const ReduxChatConnect = connect(
  mapChatStateToProps,
  mapChatDispatchToProps
);

export default ReduxChatConnect;