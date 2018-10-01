import { ChatState, updateAllUnreadMsgCount } from './ReduxChat';
import { connect } from 'react-redux';

export interface ReduxChatProps {
  // State
  chat?: ChatState;
  // Action
  updateAllUnreadMsgCount?: (allUnreadMsgCount: number) => any;
}

// State => Props
export const mapChatStateToProps = (state, /* ownProps */) => ({
  chat: state.chat
});

// Dispatch => Props
export const mapChatDispatchToProps = (dispatch, /* ownProps */) => ({
  updateAllUnreadMsgCount: (allUnreadMsgCount: number) => dispatch(updateAllUnreadMsgCount(allUnreadMsgCount)),
});

const ReduxChatConnect = connect(
  mapChatStateToProps,
  mapChatDispatchToProps
);

export default ReduxChatConnect;