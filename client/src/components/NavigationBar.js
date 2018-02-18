import React from 'react';

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userID: ''};
  }

  render() {
    const loggedin = () => {
      if (localStorage.getItem('userID') === 'undefined' || localStorage.getItem('userID') === '') return <a href="/login">Login</a>;
      return <a href="/logout">Log out</a>;
    };

    return (
      <ul className="navBar">
        <li><a href="/">Status Checker</a></li>
        <li><a href="/matches">Matches</a></li>
        <li style={{ float: 'right' }}>{loggedin()}</li>
      </ul>
    );
  }
}

export default NavigationBar;
