import { updateLoading } from './ReduxGlobalSetting';
import { connect } from 'react-redux';
import store from './Store';

export interface ReduxGlobalSettingProps {
  // State
  loading?: boolean;
  // Action
  updateLoading?: (loading: boolean) => any;
}

// State => Props
export const mapGlobalSettingStateToProps = (state, /* ownProps */) => ({
  loading: state.globalSetting.loading
});

// Dispatch => Props
export const mapGlobalSettingDispatchToProps = (dispatch, /* ownProps */) => ({
  updateLoading: (loading: boolean) => dispatch(updateLoading(loading))
});

export const updateLoadingState = async (loading: boolean) => {
  return store.dispatch(updateLoading(loading));
};

const ReduxGlobalSettingConnect = connect(
  mapGlobalSettingStateToProps,
  mapGlobalSettingDispatchToProps
);

export default ReduxGlobalSettingConnect;