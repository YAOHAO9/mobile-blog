import { combineReducers, createStore } from 'redux';
import userReducer from './ReduxUser';
import { connect } from 'react-redux';
import chatReducer from './ReduxChat';
import globalSettingReducer from './ReduxGlobalSetting';

const reducers = combineReducers({
  user: userReducer,
  chat: chatReducer,
  globalSetting: globalSettingReducer
});

const store = createStore(reducers);

export default store;

// State => Props
export const combineMapStateToProps = (mapStates: Function[]) => {
  return function () {
    const props = {};
    mapStates.forEach(mapState => {
      Object.assign(props, mapState(...arguments));
    });
    return props;
  };
};

// Dispatch => Props
export const combineMapDispatchToProps = (mapDispatchs: Function[]) => {
  return function () {
    const dispatchs = {};
    mapDispatchs.forEach(mapDispatch => {
      Object.assign(dispatchs, mapDispatch(...arguments));
    });
    return dispatchs;
  };
};

export const ReduxConnect = connect;