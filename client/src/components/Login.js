import React from 'react';

export default class Login extends React.Component {
  render() {
    return (
    <div>
        <p>Login via Steam OpenID. Your Steam profile ID and display name will be saved on this site.</p>
        <a href="/auth/steam">Login to Steam</a>
    </div>
    );
  }
}