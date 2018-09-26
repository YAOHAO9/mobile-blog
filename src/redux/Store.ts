import { combineReducers, createStore } from 'redux'
import userReducer from './UserRedux';

const reducers = combineReducers({
  user: userReducer
})

const store = createStore(reducers)

export default store;