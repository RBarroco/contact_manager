//useReducer allow us to have access to state and dispatch, so we can dispatch to our reducer
import React, { useReducer } from 'react';
import axios from 'axios';
import uuid from 'uuid'; //to generate random id;
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from '../types';

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User - validate authentication;
  const loadUser = async () => {
    //we can check for the localStorage.token because we have defined that on the authReducer case REGISTER_SUCCESS;
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth'); //since the /api/auth is a private route we need the token tat will be in a global header;

      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User
  const register = async FormData => {
    const config = {
      headers: { 'Content-Type': 'application/json' } //making a POST request to our Express API our end POINT is the localhost:5000/routes/users === localhost:5000/api/users
    };

    try {
      const res = await axios.post('/api/users', FormData, config); //since we have in our package.json file the "proxy" script we don't need to insert the localhost:5000 everytime;
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data //res.data is the token after passing inside of our Express API and generate that token;
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg //this err.response.data.msg comes from the /routes/users
      });
    }
  };
  // Login User
  const login = async FormData => {
    const config = {
      headers: { 'Content-Type': 'application/json' } //making a POST request to our Express API our end POINT is the localhost:5000/routes/users === localhost:5000/api/users
    };

    try {
      const res = await axios.post('/api/auth', FormData, config); //since we have in our package.json file the "proxy" script we don't need to insert the localhost:5000 everytime;
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data //res.data is the token after passing inside of our Express API and generate that token;
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg //this err.response.data.msg comes from the /routes/users
      });
    }
  };

  // Logout
  const logout = () => dispatch({ type: LOGOUT });

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  //Everything that we want to export from this context is defined inside of value; since we are defining contactContext.Provider as a component that need to wrap other components since we are passing prop.children
  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register: register,
        loadUser: loadUser,
        login: login,
        logout: logout,
        clearErrors: clearErrors
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
