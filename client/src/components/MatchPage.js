import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Teams from './Teams';
import { dateFormat } from '../utils/dateFormat';

class MatchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      {
        prevState: {
          teamScore: this.props.location.state.teamScore,
          opponentScore: this.props.location.state.opponentScore },
        teamScore: this.props.location.state.teamScore,
        opponentScore: this.props.location.state.opponentScore,
      };
    this.handleChange = this.handleChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  saveChanges() {
    if (this.state.prevState.teamScore !== this.state.teamScore ||
        this.state.prevState.opponentScore !== this.state.opponentScore) {
      axios.put('/database/matches/update-score', {
        matchID: this.props.location.state.matchID,
        teamScore: this.state.teamScore,
        opponentScore: this.state.opponentScore,
      })
      .then(response => console.log(response))
      .catch(error => console.log(error));
    }
  }

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
              <td><input type="number" id="teamScore" value={this.state.teamScore} onChange={this.handleChange} /> </td>
              <td><input type="number" id="opponentScore" value={this.state.opponentScore} onChange={this.handleChange} /> </td>
              <td>
                <button onClick={this.saveChanges}>
                  Save Score
                </button>
              </td>
            </tr>
            <tr>
              <Teams players={data.team1} matchID={this.props.location.state.matchID} />
              <Teams players={data.team2} matchID={this.props.location.state.matchID} />
            </tr>
          </tbody>
        </table>

      </div>
    );
  }
}

export default MatchPage;

MatchPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      matchID: PropTypes.number,
      team1: PropTypes.array,
      team2: PropTypes.array,
      addedAt: PropTypes.string,
      map: PropTypes.string,
      teamScore: PropTypes.number,
      opponentScore: PropTypes.number,
    }),
  }).isRequired,
};
