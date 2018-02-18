import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import StatusInput from './StatusInput';
import MatchContainer from './MatchContainer';
import Logout from './Logout';
import Login from './Login';
import NotFound from './NotFound';

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <NavigationBar />
        <Switch>
          <Route exact path="/" component={StatusInput} />
          <Route path="/matches" component={MatchContainer} />
          <Route path="/logout" component={Logout} />
          <Route path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </div>);
  }
}
