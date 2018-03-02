import React from 'react';
import axios from 'axios';

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    axios.get('/user')
      .then((res) => {
        
        localStorage.setItem('userID', res.data.user);
        localStorage.setItem('steamid64', res.data.steamid64);
      })
      .catch(err => console.log(err));
  }

  render() {
    const loggedin = () => {
      if (!localStorage.getItem('userID') || localStorage.getItem('userID') === 'undefined' || localStorage.getItem('userID') === '') return <a href="/auth/steam">Login to Steam</a>;
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
