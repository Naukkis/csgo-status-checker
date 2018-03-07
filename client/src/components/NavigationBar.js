import React from 'react';

function handleClick() {
  localStorage.clear();
}

const loggedin = () => {
  if (!localStorage.getItem('userID') ||
    localStorage.getItem('userID') === 'undefined' ||
    localStorage.getItem('userID') === '') return <a href="/auth/steam">Login to Steam</a>;
  return <a href="/logout" onClick={handleClick}>Log out</a>;
};

const NavigationBar = () => {
  return (
    <ul className="navBar">
      <li><a href="/">Status Checker</a></li>
      <li><a href="/matches">Matches</a></li>
      <li style={{ float: 'right' }}>{loggedin()}</li>
    </ul>
  );
};

export default NavigationBar;
