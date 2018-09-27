import User from '../models/User.model';
import { updateUser } from './ReduxUser';
import { connect } from 'react-redux';

export interface ReduxUserProps {
  // State
  user?: User;
  // Action
  updateUser?: (user: User) => any;
}

// State => Props
export const mapUserStateToProps = (state, /* ownProps */) => ({
  user: state.user
});

// Dispatch => Props
export const mapUserDispatchToProps = (dispatch, /* ownProps */) => ({
  updateUser: (user: User) => dispatch(updateUser(user))
});

const ReduxUserConnect = connect(
  mapUserStateToProps,
  mapUserDispatchToProps
);

export default ReduxUserConnect;