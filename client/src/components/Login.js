import React from 'react';
import axios from 'axios';

export default class Login extends React.Component {
  componentWillMount() {
    axios.get('/user')
      .then((res) => {
        localStorage.setItem('userID', res.data.user);
        this.setState({ userID: res.data.user });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
    <div>
        <p>Login via Steam OpenID. Your Steam profile ID and display name will be saved on this site.</p>
        <a href="/auth/steam">Login to Steam</a>
    </div>
    );
  }
}