import React from 'react';
import { playerSummaries } from '../utils/apiCalls';
import PlayerProfileMini from './PlayerProfileMini';

class Teams extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playerSummaries: '' }
    const ids = this.props.players.map(x => x.steamid64);
    playerSummaries(ids, (summaries) => {
      this.setState({ playerSummaries: summaries });
    });
  }


  render() {
    const tdStyle = {
      maxWidth: 400,
      wordWrap: 'break-word',
    };

    if (!this.state.playerSummaries) {
      return <td>Loading</td>
    }
    return <td style={tdStyle}> {this.state.playerSummaries.map(player => <PlayerProfileMini playerSummary={player} />) } </td>
  }
}

export default Teams;
