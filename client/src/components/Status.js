import React from 'react';
import findSteamID from '../utils/SteamIdConverter';
import { playerSummaries } from '../utils/apiCalls';
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
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    const listOfIds = findSteamID(this.state.value);
    playerSummaries(listOfIds.query, (data) => {
      this.setState({ playerSummaries: data, steamids: listOfIds.arr });
    });
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
