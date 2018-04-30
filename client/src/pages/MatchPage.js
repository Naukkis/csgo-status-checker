import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Teams from '../components/Teams';
import { dateFormat } from '../utils/dateFormat';
import { playerSummaries, banStatus } from '../utils/apiCalls';
import MapSelector from '../components/buttons/MapSelector';

class MatchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      {
        prevState: {
          teamScore: this.props.location.state.teamScore,
          opponentScore: this.props.location.state.opponentScore,
        },
        teamScore: this.props.location.state.teamScore,
        opponentScore: this.props.location.state.opponentScore,
        team1: [],
        team2: [],
      };
    this.handleChange = this.handleChange.bind(this);
    this.handleMapChange = this.handleMapChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  async componentWillMount() {
    const ids = [
      ...this.props.location.state.team1.map(x => x.steamid64),
      ...this.props.location.state.team2.map(x => x.steamid64),
    ];

    this.setState({ listOfIds: ids });
    const summaries = await playerSummaries(ids);
    const banStatuses = await banStatus(ids);

    const combineTeamInfo = (team) => {
      return team.map((player) => {
        const combinedInfo = {};
        combinedInfo.steamid64 = player.steamid64;
        combinedInfo.match = player;
        combinedInfo.summary = summaries.filter(x => x.steamid === player.steamid64);
        combinedInfo.banInfo = banStatuses.filter(x => x.SteamId === player.steamid64);
        return combinedInfo;
      });
    };

    const team1 = combineTeamInfo(this.props.location.state.team1);
    const team2 = combineTeamInfo(this.props.location.state.team2); 
    this.setState({ team1, team2 });
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleMapChange(e) {
    axios.post(
      '/api/matches/update-map',
      {
        mapPlayed: e.target.value,
        matchID: this.props.location.state.matchID,
        userID: localStorage.getItem('userID'),
      },
    )
      .catch(err => console.log(err));
  }

  saveChanges() {
    if (this.state.prevState.teamScore !== this.state.teamScore ||
      this.state.prevState.opponentScore !== this.state.opponentScore) {
      axios.put('/api/matches/update-score', {
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
              <td><MapSelector onChange={this.handleMapChange} map={data.map} /></td>
              <td><input type="number" id="teamScore" value={this.state.teamScore} onChange={this.handleChange} /> </td>
              <td><input type="number" id="opponentScore" value={this.state.opponentScore} onChange={this.handleChange} /> </td>
              <td>
                <button onClick={this.saveChanges}>
                  Save Score
                </button>
              </td>
            </tr>
            <tr>
              {this.state.team1.length > 0 &&
                <Teams players={this.state.team1} matchID={data.matchID} />
              }
              {this.state.team2.length > 0 &&
                <Teams players={this.state.team2} matchID={data.matchID} />
              }
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
