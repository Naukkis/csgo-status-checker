import React, { Component } from 'react';
import Status from './components/Status';
import NavigationBar from './components/NavigationBar';

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
