import React from 'react';


class NavigationBar extends React.Component {

  render() {
    return (
      <ul className="navBar">
        <li><a href="/">Status Checker</a></li>
        <li><a href="/matches">Matches</a></li>
        <li style={{float: 'right'}}><a href="http://localhost:3001/auth/steam">Login</a></li>
      </ul>
    );
  }
}

export default NavigationBar;
