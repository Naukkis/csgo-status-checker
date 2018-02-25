import React from 'react';
import PropTypes from 'prop-types';
import { playerSummaries, banStatus } from '../utils/apiCalls';
import PlayerProfileMini from './PlayerProfileMini';


class Teams extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playerSummaries: '', banInfo: null };
    const ids = this.props.players.map(x => x.steamid64);
    playerSummaries(ids, (summaries) => {
      this.setState({ playerSummaries: summaries });
    });
    banStatus(ids, data => this.setState({ banInfo: data }));
  }


  render() {
    const tdStyle = {
      maxWidth: 400,
      wordWrap: 'break-word',
    };
    const bans = (steamid) => {
      if (this.state.banInfo) {
        return this.state.banInfo.filter(x => x.SteamId === steamid)[0];
      }
      return null;
    };

    const playerComment = steamid => (
      this.props.players.filter(x => x.steamid64 === steamid)[0].player_comment
    );

    if (!this.state.playerSummaries) {
      return <td>Loading</td>;
    }

    return (
      <td style={tdStyle}>
        { this.state.banInfo &&
          this.state.playerSummaries.map(player =>
            (<PlayerProfileMini
              key={`profile${player.steamid}}`}
              playerSummary={player}
              banInfo={bans(player.steamid)}
              matchID={this.props.matchID}
              comment={playerComment(player.steamid)}
            />)) }
      </td>);
  }
}

export default Teams;

Teams.propTypes = {
  players: PropTypes.array.isRequired,
  matchID: PropTypes.number.isRequired,
};
