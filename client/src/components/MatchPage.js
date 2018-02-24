import React from 'react';
import PropTypes from 'prop-types';
import Teams from './Teams';
import { dateFormat } from '../utils/dateFormat';

class MatchPage extends React.Component {

  render() {
    const data = this.props.location.state;
    return (
      <div>
        <table className="matches">
          <thead>
            <tr>
              <th>Date</th>
              <th>Map</th>
              <th colSpan="2">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{dateFormat(data.addedAt)}</td>
              <td>{data.map}</td>
              <td>{data.teamScore}</td>
              <td>{data.opponentScore}</td>
            </tr>
            <tr>
              <Teams players={data.team1} />
              <Teams players={data.team2} />
            </tr>
          </tbody>
        </table>
        <button>Save comments</button>
      </div>
    );
  }
}

export default MatchPage;

MatchPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      team1: PropTypes.array,
      team2: PropTypes.array,
      addedAt: PropTypes.string,
      map: PropTypes.string,
      teamScore: PropTypes.number,
      opponentScore: PropTypes.number,
    }),
  }).isRequired,
};
