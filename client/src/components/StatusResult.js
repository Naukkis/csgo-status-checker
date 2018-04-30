import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import PlayerProfile from './PlayerProfile';
import AddTeammate from './buttons/AddTeammate';
import MapPicker from './MapPicker';

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
        matchSaved: false,
        match: {},
      };
    this.selectTeam = this.selectTeam.bind(this);
    this.saveMatch = this.saveMatch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMapPick = this.handleMapPick.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleMapPick(e) {
    this.setState({ map: e.target.value });
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

  saveMatch(e) {
    e.preventDefault();
    if (this.state.map === 'empty' || this.state.map === '') {
      this.setState({ error: 'Pick a map first' });
      setTimeout(() => {
        this.setState({ error: null });
      }, 5000);
      return;
    }
    
    const match = {
      team1: this.state.teammates,
      team2: this.state.opponents,
      teamScore: this.state.teamScore,
      opponentScore: this.state.opponentScore,
      map: this.state.map,
      added_at: new Date(),
    }

    axios.post('/api/add-match', {
      teammates: this.state.teammates,
      opponents: this.state.opponents,
      teamScore: this.state.teamScore,
      opponentScore: this.state.opponentScore,
      map: this.state.map,
    })
      .then((response) => {
        if (response.data.status === 'success') {
          match.matchID = response.data.matchID;
          this.setState({ matchSaved: true, match: match });
        }
      })
      .catch((err) => {
        this.setState({ error: 'Match could not be saved, please try again or if problem persists, contact naukkis @ quakenet/ircnet' });
        setTimeout(() => {
          this.setState({ error: null });
        }, 5000);
      });
  }

  teamSelector = (steamid) => {
    let buttonText = isTeammate(steamid, this.state.teammates) ?  'Add to your team' : 'Remove from your team';
    return buttonText;
  };

  render() {
    const previousMatches = (steamid) => {
      if (this.props.previouslyPlayedWith) {
        return this.props.previouslyPlayedWith.filter(x => x.steamid64 === steamid);
      }
    }

    const linkProps = () => {
      return {
        pathname: '/matches/',
        state: {
          matchID: this.state.match.match_id,
          team1: this.state.match.team1,
          team2: this.state.match.team2,
          addedAt: this.state.match.added_at,
          map: this.state.match.map_played,
          teamScore: this.state.match.team_score,
          opponentScore: this.state.match.opponent_score,
        },
      };
    };

    const errorStyle = { color: 'red', borderStyle: 'solid', borderColor: 'yellow', maxWidth: 200 };

    return (
      <div className="addMatch">
        {this.state.error && <p style={errorStyle} >{this.state.error} </p>}
        <button id="saveMatch" onClick={this.saveMatch}>Add match</button>

        <h3>Pick a Map</h3>
        <div className="mapPicker">
          <MapPicker selected={this.state.map} onChange={this.handleMapPick} />
        </div>
        <div className="flex-container">
          {this.props.playerSummaries.map(data => (
            <span className="item" key={data.steamid}>
              <PlayerProfile
                summary={data}
                previouslyPlayedWith={previousMatches(data.steamid)}
                matches={this.props.matches}
                banInfo={this.props.banStatuses.filter(x => x.SteamId === data.steamid)[0]}
                playerSummaries={this.props.playerSummaries}
              >
                <AddTeammate
                  steamid={data.steamid}
                  onClick={this.selectTeam}
                  text={this.teamSelector(data.steamid)}
                />
              </PlayerProfile>
            </span>
          ))}
        </div>
        {this.state.matchSaved &&
          <Redirect
            to={linkProps()}
          />}
      </div>);
  }
}

StatusResult.propTypes = {
  playerSummaries: PropTypes.arrayOf(PropTypes.object).isRequired,
  steamids: PropTypes.arrayOf(PropTypes.string).isRequired,
  previouslyPlayedWith: PropTypes.array.isRequired,
  matches: PropTypes.array.isRequired,
  banStatuses: PropTypes.array.isRequired,
};

export default StatusResult;
