import React from 'react';
import PlayerProfile from './PlayerProfile';
import { playerSummaries } from '../utils/apiCalls';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playerSummary: {} };
  }

  componentDidMount() {
    playerSummaries(localStorage.get('steamid'), data => this.setState({ playerSummary: data }));
  }

  render() {
    return (
      <PlayerProfile playerSummary={this.state.playerSummary} />
    );
  }
}

export default Profile;
