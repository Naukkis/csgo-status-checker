import React, { Component } from 'react';
import StatusInput from './components/StatusInput';
import NavigationBar from './components/NavigationBar';

// eslint-disable-next-line
class App extends Component {
  render() {
    return (
      <div className="App ui text container">
        <NavigationBar />
        <StatusInput />
      </div>);
  }
}

export default App;
