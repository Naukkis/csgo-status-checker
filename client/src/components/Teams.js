import React from 'react';
import PropTypes from 'prop-types';
import PlayerProfile from './PlayerProfile';

// eslint-disable-next-line
class Teams extends React.Component {
  render() {
    const tdStyle = {
      maxWidth: 400,
      wordWrap: 'break-word',
    };
    const playerSummaries = this.props.players.map(x => x.summary[0]);
    return (
      <td style={tdStyle}>
        {this.props.players.map(player =>
          (<PlayerProfile
            key={`profile${player.steamid64}}`}
            summary={player.summary[0]}
            banInfo={player.banInfo[0]}
            matchID={this.props.matchID}
            playerSummaries={playerSummaries}
          />))}
      </td>);
  }
}

export default Teams;

Teams.propTypes = {
  players: PropTypes.array.isRequired,
  matchID: PropTypes.number.isRequired,
};
