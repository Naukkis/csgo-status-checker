import React, { Component } from 'react';
import Status from './Status';
import NavigationBar from './NavigationBar';

// eslint-disable-next-line
class App extends Component {
  render() {
    return (
      <div className="App ui text container">
        <NavigationBar />
        <Status />
      </div>);
  }
}

export default App;
