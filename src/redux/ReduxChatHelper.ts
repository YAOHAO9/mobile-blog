import { ChatState, updateChatedUsers, updateAllUnreadMsgCount } from './ReduxChat';
import { connect } from 'react-redux';
import ChatedUser from '../models/ChatedUser.model';

export interface ReduxChatProps {
  // State
  chat?: ChatState;
  // Action
  updateAllUnreadMsgCount?: (allUnreadMsgCount: number) => any;
  updateChatedUsers?: (chatedUsers: ChatedUser[]) => any;
}

// State => Props
export const mapChatStateToProps = (state, /* ownProps */) => ({
  chat: state.chat
});

// Dispatch => Props
export const mapChatDispatchToProps = (dispatch, /* ownProps */) => ({
  updateAllUnreadMsgCount: (allUnreadMsgCount: number) => dispatch(updateAllUnreadMsgCount(allUnreadMsgCount)),
  updateChatedUsers: (chatedUsers: ChatedUser[]) => dispatch(updateChatedUsers(chatedUsers)),
});

const ReduxChatConnect = connect(
  mapChatStateToProps,
  mapChatDispatchToProps
);

export default ReduxChatConnect;