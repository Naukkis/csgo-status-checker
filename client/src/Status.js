import React from 'react';
import axios from 'axios';
import { steamidTo64 } from './SteamIdConverter';
import PlayerProfile from './PlayerProfile';

class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      playerSummaries: [],
      steamids: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getPlayerSummaries = this.getPlayerSummaries.bind(this);
  }

  getPlayerSummaries(steamids) {
    axios.get(`getPlayerSummary/?q=${steamids}`)
      .then((response) => {
        this.setState({ playerSummaries: response.data.response.players });
      })
      .catch(err => console.log(err));
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    const steamIDregex = /STEAM_(0|1):(0|1):\d{1,}/g;
    let summaryQueryForAll = '';

    const inputString = this.state.value;
    const matches = [];
    let tempMatches;
    // eslint-disable-next-line
    while ((tempMatches = steamIDregex.exec(inputString)) !== null) {
      matches.push(tempMatches[0]);
    }
    if (matches.length > 0) {
      const id64 = matches.map(id => steamidTo64(id));
      this.setState({ steamids: id64 });
      id64.forEach((id) => { summaryQueryForAll += `${id},`; });
    } else {
      summaryQueryForAll = inputString.trim();
    }

    this.getPlayerSummaries(summaryQueryForAll);

    event.preventDefault();
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
        { this.state.playerSummaries.length > 0 &&
          <ul className="playersummaries">
            { this.state.playerSummaries.map(data =>
             (
               <li key={data.steamid}>
                 <PlayerProfile playerSummary={data} listOfIds={this.state.steamids} />
               </li>)) }
          </ul>
        }
      </div>
    );
  }
}

export default Status;
