import React from 'react';
import PropTypes from 'prop-types';
import PlayerProfile2 from './PlayerProfile2';

// eslint-disable-next-line
class Teams extends React.Component {
  render() {
    const tdStyle = {
      maxWidth: 400,
      wordWrap: 'break-word',
    };
    return (
      <td style={tdStyle}>
        {this.props.players.map(player =>
          (<PlayerProfile2
            key={`profile${player.steamid64}}`}
            summary={player.summary[0]}
            banInfo={player.banInfo[0]}
            matchID={this.props.matchID}
            listOfIds={this.props.listOfIds}
          />))}
      </td>);
  }
}

export default Teams;

Teams.propTypes = {
  players: PropTypes.array.isRequired,
  matchID: PropTypes.number.isRequired,
  listOfIds: PropTypes.array.isRequired,
};
