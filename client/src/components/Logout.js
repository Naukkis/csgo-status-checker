import React from 'react';
import axios from 'axios';

const Logout = () => {
  localStorage.setItem('userID', '');
  axios.get('/logout')
    .catch(err => console.log(err));
  return <p>Logged out</p>;
};
export default Logout;

