import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from './components/NavigationBar';
import StatusInput from './pages/StatusInput';
import MatchContainer from './pages/MatchContainer';
import MatchPage from './pages/MatchPage';
import NotFound from './pages/NotFound';

// eslint-disable-next-line
class App extends Component {
  componentWillMount() {
    axios.get('/user')
      .then((res) => {
        localStorage.setItem('userID', res.data.user);
        localStorage.setItem('steamid64', res.data.steamid64);
      })
      .catch(err => console.log(err));
  }
  
  render() {
    return (
      <div className="App ui text container">
        <NavigationBar />
        <Switch>
          <Route exact path="/" component={StatusInput} />
          <Route exact path="/matches" component={MatchContainer} />
          <Route path="/matches/:id" component={MatchPage} />
          <Route component={NotFound} />
        </Switch>
      </div>);
  }
}

export default App;
