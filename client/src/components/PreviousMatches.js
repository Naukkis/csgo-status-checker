import React from 'react';
import { Link } from 'react-router-dom';
import { dateFormat } from '../utils/dateFormat';

class PreviousMatches extends React.Component { 
  render() {
    const linkProps = (x) => {
      return {
        pathname: `/matches/${x.match_id}`,
        state: {
          matchID: x.match_id,
          team1: x.team1,
          team2: x.team2,
          addedAt: x.added_at,
          map: x.map_played,
          teamScore: x.team_score,
          opponentScore: x.opponent_score,
        },
      };
    };

    if (this.props.previouslyPlayedWith.length < 1) {
      return null;
    }
    return (
      <div>
        <p>You have added the player previously on: </p>
        {this.props.matches.map((x) => {
          return (
            <Link
              to={linkProps(x)}
              href={`/matches/${x.match_id}`}
              key={x.match_id}
            >
              <p>{dateFormat(x.added_at)}</p>
            </Link>)
        })}
      </div>
    )
  }
}
export default PreviousMatches;