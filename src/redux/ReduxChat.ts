import Chat from '../models/Chat.model';
import ChatedUser from '../models/ChatedUser.model';

const UpdateAllUnreadMsgCount = 'UpdateAllUnreadMsgCount';
const UpdateChatedUsers = 'UpdateChatedUsers';

export interface ChatState {
  allUnreadMsgCount: number;
  chatedUsers: ChatedUser[];
  chatList: Chat[];
}

// Action
export const updateAllUnreadMsgCount = (allUnreadMsgCount: number) => ({
  type: UpdateAllUnreadMsgCount,
  allUnreadMsgCount
});

export const updateChatedUsers = (chatedUsers: ChatedUser[]) => ({
  type: UpdateChatedUsers,
  chatedUsers
});

const initChatState = {
  allUnreadMsgCount: 0,
  chatedUsers: [],
  chatList: [],
};

// Reducer
const chatReducer = (state: ChatState = initChatState, action) => {
  switch (action.type) {
    case UpdateAllUnreadMsgCount:
      state = Object.assign({}, state, { allUnreadMsgCount: action.allUnreadMsgCount });
      return state;
    case UpdateChatedUsers:
      state = Object.assign({}, state, { chatedUsers: action.chatedUsers });
      return state;
    default:
      return state;
  }
};

export default chatReducer;