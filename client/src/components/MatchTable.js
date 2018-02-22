import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from '../utils/dateFormat';
import Teams from './Teams';

const MatchTable = props =>
  (
    <table className="matches">
      <thead>
        <tr>
          <th>Date</th>
          <th>Map</th>
          <th>Score</th>
          <th>Your team</th>
          <th>Opponents</th>
        </tr>
      </thead>
      <tbody>
        { props.matches.map(x =>
      (
        <tr key={`row_${x.match_id}`}>
          <td>{dateFormat(x.added_at)}</td>
          <td>{x.map_played}</td>
          <td>{x.team_score} - {x.opponent_score}</td>
          <Teams players={x.team1} />
          <Teams players={x.team2} />
        </tr>
       
      ))}
       
      </tbody>
    </table>);

export default MatchTable;

MatchTable.propTypes = {
  matches: PropTypes.array.isRequired,
};
