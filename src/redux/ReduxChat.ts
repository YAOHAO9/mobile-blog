import Chat from '../models/Chat.model';
import ChatedUser from '../models/ChatedUser.model';

enum ActionType {
  UpdateAllUnreadMsgCount = 'UpdateAllUnreadMsgCount',
  UpdateChatedUsers = 'UpdateChatedUsers',
  UpdateChatList = 'UpdateChatList',
}
export interface ChatState {
  allUnreadMsgCount: number;
  chatedUsers: ChatedUser[];
  chatList: Chat[];
}

// Action
export const decreaseAllUnreadMsgCount = (allUnreadMsgCount: number) => ({
  type: ActionType.UpdateAllUnreadMsgCount,
  allUnreadMsgCount
});

export const updateAllUnreadMsgCount = (allUnreadMsgCount: number) => ({
  type: ActionType.UpdateAllUnreadMsgCount,
  allUnreadMsgCount
});

export const updateChatedUsers = (chatedUsers: ChatedUser[]) => ({
  type: ActionType.UpdateChatedUsers,
  chatedUsers
});

export const updateChatList = (chatList: Chat[]) => ({
  type: ActionType.UpdateChatList,
  chatList
});

const initChatState = {
  allUnreadMsgCount: 0,
  chatedUsers: [],
  chatList: [],
};

// Reducer
const chatReducer = (state: ChatState = initChatState, action) => {
  switch (action.type) {
    case ActionType.UpdateAllUnreadMsgCount:
      state = Object.assign({}, state, { allUnreadMsgCount: action.allUnreadMsgCount });
      return state;
    case ActionType.UpdateChatedUsers:
      state = Object.assign({}, state, { chatedUsers: action.chatedUsers });
      return state;
    case ActionType.UpdateChatList:
      state = Object.assign({}, state, { chatList: action.chatList });
      return state;
    default:
      return state;
  }
};

export default chatReducer;