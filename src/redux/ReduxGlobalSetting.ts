
enum ActionType {
  UpdateLoading = 'UpdateLoading',
}

export interface GlobalSettingState {
  loading: boolean;
}

// Action
export const updateLoading = (loading: boolean) => ({
  type: ActionType.UpdateLoading,
  loading
});

const initGlobalSettingState = {
  loading: false,
};

// Reducer
const globalSettingReducer = (state: GlobalSettingState = initGlobalSettingState, action) => {
  switch (action.type) {
    case ActionType.UpdateLoading:
      state = Object.assign({}, state, { loading: action.loading });
      return state;
    default:
      return state;
  }
};

export default globalSettingReducer;