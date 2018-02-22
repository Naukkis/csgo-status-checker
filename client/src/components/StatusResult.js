import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import PlayerProfile from './PlayerProfile';
import MapSelector from './MapSelector';
import ScoreInput from './ScoreInput';

function isTeammate(playerid, teammates) {
  let filter = false;
  teammates.forEach((x) => {
    if (x === playerid) {
      filter = true;
    }
  });
  return !filter;
}

class StatusResult extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      {
        teammates: [],
        opponents: [],
        map: '',
        teamScore: 0,
        opponentScore: 0,
      };
    this.selectTeam = this.selectTeam.bind(this);
    this.saveMatch = this.saveMatch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  selectTeam(e) {
    e.preventDefault();
    const playerid = e.target.id;
    const mates = this.state.teammates;
    if (isTeammate(playerid, mates)) {
      mates.push(playerid);
    } else {
      let remove;
      mates.forEach((x, i) => {
        if (x === playerid) {
          remove = i;
        }
      });
      mates.splice(remove, 1);
    }
    const opponents = this.props.steamids.filter(x => isTeammate(x, this.state.teammates));
    this.setState({ teammates: [...mates], opponents: [...opponents] });
  }

  saveMatch() {
    if (this.state.map === 'empty' || this.state.map === '') {
      alert('Pick a map!');
      return;
    }

    axios.post('/database/add-match', {
      teammates: this.state.teammates,
      opponents: this.state.opponents,
      teamScore: this.state.teamScore,
      opponentScore: this.state.opponentScore,
      map: this.state.map,
    })
      .then((response) => {
        if(response.data.status === 'success') {
          alert('Match saved!');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <button id="saveMatch" onClick={this.saveMatch}>Add match</button>
        <MapSelector onChange={this.handleChange} />
        <ScoreInput id="teamScore" onChange={this.handleChange} />
        <ScoreInput id="opponentScore" onChange={this.handleChange} />
        <div className="flex-container">
        { this.props.playerSummaries.map(data => (
          <span className="item" key={data.steamid}>
            <PlayerProfile
              playerSummary={data}
              listOfIds={this.props.steamids}
              onClick={this.selectTeam}
              teammate={isTeammate(data.steamid, this.state.teammates)}
            />
          </span>
        ))}
        </div>
      </div>);
  }
}


StatusResult.propTypes = {
  playerSummaries: PropTypes.arrayOf(PropTypes.object).isRequired,
  steamids: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default StatusResult;
