import User from "../models/User.model";

const UpdateUser = 'UPDATE_USER'

export interface UserRedux {
  // State
  user: User,
  // Action
  updateUser: (user: User) => any
}

// State
export const mapUserStateToProps = (state, /* ownProps */) => ({
  user: state.user
})

// Dispatch
export const mapUserDispatchToProps = (dispatch, /* ownProps */) => ({
  updateUser: (user: User) => dispatch(updateUser(user))
})

// Action
export const updateUser = (user: User) => ({
  type: UpdateUser,
  user
})

const initUser = new User();
initUser.name = "HAHAHAHAHAHH"

// Reducer
const userReducer = (state: User = initUser, action) => {
  switch (action.type) {
    case UpdateUser:
      state = action.user
    default:
      return state
  }
}
export default userReducer