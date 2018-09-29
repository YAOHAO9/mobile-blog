import User from '../models/User.model';

const UpdateUser = 'UPDATE_USER';

// Action
export const updateUser = (user: User) => ({
  type: UpdateUser,
  user
});

// Reducer
const userReducer = (state: User = new User(), action) => {
  switch (action.type) {
    case UpdateUser:
      state = action.user;
      return state;
    default:
      return state;
  }
};

export default userReducer;