
enum ActionType {
  UpdateAllUnreadMsgCount = 'UpdateAllUnreadMsgCount',
  UpdateChatedUsers = 'UpdateChatedUsers',
  UpdateChatList = 'UpdateChatList',
}

export interface ChatState {
  allUnreadMsgCount: number;
}

// Action
export const updateAllUnreadMsgCount = (allUnreadMsgCount: number) => ({
  type: ActionType.UpdateAllUnreadMsgCount,
  allUnreadMsgCount
});

const initChatState = {
  allUnreadMsgCount: 0,
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