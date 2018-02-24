import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { dateFormat, countDaysSinceToday } from '../utils/dateFormat';

class MatchTable extends React.Component {
  render() {
    const bannedAt = (addedAt, daysSinceLastBan) => {
      let difference = countDaysSinceToday(addedAt) - daysSinceLastBan;
      if (difference > 0) {
        difference *= -1;
        return `Someone banned ${difference} days after the match`;
      }
      difference *= -1;
      return `Someone banned ${difference} days before the match`;
    };

    return (
      <table className="matches">
        <thead>
          <tr>
            <th>Date</th>
            <th>Map</th>
            <th colSpan="2">Score</th>
            <th>Bans</th>
          </tr>
        </thead>
        <tbody>
          { this.props.matches.map(x =>
        (
          <tr id={x.match_id} key={`row_${x.match_id}`}>
            <td>
              <Link
                to={{
                  pathname: `/matches/${x.match_id}`,
                  state: {
                    team1: x.team1,
                    team2: x.team2,
                    addedAt: x.added_at,
                    map: x.map_played,
                    teamScore: x.team_score,
                    opponentScore: x.opponent_score,
                  },
                }}
                key={x.match_id}
              >
                { dateFormat(x.added_at)}
              </Link>
            </td>
            <td>{x.map_played}</td>
            <td>{x.team_score}</td>
            <td>{x.opponent_score}</td>
            {x.bannedPlayers.length > 0 &&
              <td>{ bannedAt(x.added_at, x.bannedPlayers[0].DaysSinceLastBan) }</td> }
          </tr>
        ))}  
        </tbody>
      </table>);
  }
}


export default MatchTable;

MatchTable.propTypes = {
  matches: PropTypes.array.isRequired,
};
