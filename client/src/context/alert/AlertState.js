//useReducer allow us to have access to state and dispatch, so we can dispatch to our reducer
import React, { useReducer } from 'react';
import uuid from 'uuid'; //to generate random id;
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { SET_ALERT, REMOVE_ALERT } from '../types';

const AlertState = props => {
  const initialState = [];

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert -> beautiful way of setting time out;
  const setAlert = (msg, type, timeout = 5000) => {
    const id = uuid.v4();
    dispatch({
      type: SET_ALERT,
      payload: { msg, type, id }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };

  // Everything that we want to export from this context is defined inside of value; since we are defining contactContext.Provider as a component that need to wrap other components since we are passing prop.children
  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
