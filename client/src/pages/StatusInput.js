import React from 'react';
import axios from 'axios';
import StatusResult from '../components/StatusResult';
import findSteamID from '../utils/SteamIdConverter';
import { playerSummaries } from '../utils/apiCalls';

class StatusInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      playerSummaries: [],
      steamids: [],
      previousMatches: [],
      matches: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.matchInfo = this.matchInfo.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    const queryReducer = (previousMatches) => {
      const idset = new Set();
      previousMatches.forEach(x => idset.add(x.match_id));
      return idset;
    }

    event.preventDefault();
    const listOfIds = findSteamID(this.state.value);
    axios.post('/api/previously-played-with', {
      steamid64: localStorage.getItem('steamid64'),
      playersToSearch: listOfIds.query,
    })
      .then((res) => {
        this.setState({ previousMatches: res.data.data });
        this.matchInfo(queryReducer(res.data.data));
      })
      .catch(err => console.log(err));

    playerSummaries(listOfIds.query, (data) => {
      this.setState({ playerSummaries: data, steamids: listOfIds.arr });
    });
  }

  matchInfo(matches) {
    if (matches) {
      const params = [...matches].join(',');
      axios.get(`/api/matches/info?q=${params}`)
        .then((res) => {
          res.data.data.forEach((matchData) => {
            axios.get(`/api/players-from-match/?q=${matchData.match_id}`)
              .then((response) => {
                const match = matchData;
                match.team1 = response.data.team1;
                match.team2 = response.data.team2;
                const tempState = this.state.matches;
                tempState.push(match);
                this.setState({ matches: [...tempState] });
              })
              .catch(err => console.log(err));
          });
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="status">
            When in a CS:GO match, type &apos;status&apos; to console. Paste the result here.
            Single SteamIDs or Steam64IDs work as well.
             <textarea id="status" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.state.playerSummaries.length > 0 &&
          <StatusResult
            playerSummaries={this.state.playerSummaries}
            steamids={this.state.steamids}
            matches={this.state.matches}
            previouslyPlayedWith={this.state.previousMatches}
          />
        }
      </div>
    );
  }
}

export default StatusInput;
