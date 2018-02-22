import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import StatusInput from './components/StatusInput';
import MatchContainer from './components/MatchContainer';
import Logout from './components/Logout';
import Login from './components/Login';
import NotFound from './components/NotFound';

// eslint-disable-next-line
class App extends Component {

  render() {
    return (
      <div className="App ui text container">
        <NavigationBar />
        <Switch>
          <Route exact path="/" component={StatusInput} />
          <Route path="/matches" component={MatchContainer} />
          <Route component={NotFound} />
        </Switch>
      </div>);
  }
}

export default App;
