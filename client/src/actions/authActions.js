import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { SET_CURRENT_USER } from '../actions/types';

import { GET_ERRORS } from './types';


// Register User
export const registerUser = (userData, history) => dispatch => {
  axios.post('api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


//Login: Get user token
export const loginUser = (userData) => dispatch => {
  //POST request to route that gets token
  axios.post('api/users/login', userData)
    .then(res => {
      //Save to localStorage
      const { token } = res.data;
      //Set token to localStorate
      localStorage.setItem('jwtToken', token);
      //Set token to Auth header
      setAuthToken(token);
      //Decode token to get user date
      const decoded = jwt_decode(token);
      //Set current user
      dispatch(setCurrentUser(decoded));

    })
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
}

//Set logged in user
export const setCurrentUser = (decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
})

//Log user out
export const logoutUser = () => dispatch => {
  //Remove toek nfrom localStorage
  localStorage.removeItem('jwtToken');
  //Remove auth header ffor future requests
  setAuthToken(false);
  //Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
}
