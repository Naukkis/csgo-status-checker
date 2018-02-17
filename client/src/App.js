import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import StatusInput from './components/StatusInput';
import Matches from './components/Matches';


// eslint-disable-next-line
class App extends Component {

  render() {
    return (
      <div className="App ui text container">
        <NavigationBar />
        <Switch>
          <Route exact path="/" component={StatusInput} />
          <Route path="/matches" component={Matches} />
        </Switch>
      </div>);
  }
}

export default App;
