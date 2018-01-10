import React, { Component } from 'react';
import Status from './Status';
import NavigationBar from './NavigationBar';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <div className='ui text container'>
        	<NavigationBar />
        	<Status />
        </div>
      </div>
          );
  }
}

export default App;
