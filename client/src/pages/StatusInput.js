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
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const listOfIds = findSteamID(this.state.value);
    axios.post('/database/previously-played-with', {
      steamid64: localStorage.getItem('steamid64'),
      playersToSearch: listOfIds.query,
    })
      .then(res => this.setState({ previousMatches: res.data.data }))
      .catch(err => console.log(err));

    playerSummaries(listOfIds.query, (data) => {
      this.setState({ playerSummaries: data, steamids: listOfIds.arr });
    });
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
        {this.state.previousMatches.length > 0 &&
          <p>You have played some of these players in
           {this.state.previousMatches.map(x => ` ${x.match_id} `)}
          </p>}
        {this.state.playerSummaries.length > 0 &&
          <StatusResult
            playerSummaries={this.state.playerSummaries}
            steamids={this.state.steamids}
          />
        }
      </div>
    );
  }
}

export default StatusInput;
