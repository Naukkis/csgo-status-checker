import React from 'react';
import { steamidTo64 } from "./SteamIdConverter";
import PlayerProfile from "./PlayerProfile";

class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '',
                  playerSummaries: [],
                  playerStats: [],
                  recentlyPlayedCSGO: {},
                  steamids: []
                };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getPlayerSummaries = this.getPlayerSummaries.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    let steamIDregex = /STEAM_(0|1):(0|1):\d{1,}/g;
    let summaryQueryForAll = "";

    let inputString = this.state.value;
    let matches = [];
    let tempMatches;
    // eslint-disable-next-line
    while ((tempMatches = steamIDregex.exec(inputString)) !== null) {
      matches.push(tempMatches[0]);
    }
    console.log(matches);
    if (matches.length > 0) {
      let id64 = matches.map(id => steamidTo64(id));
      this.setState({ steamids: id64});
      id64.map(id => summaryQueryForAll += id + ",");

    } else {
        summaryQueryForAll = inputString.trim();
    }

    console.log(summaryQueryForAll);
    this.getPlayerSummaries(summaryQueryForAll, function(result) {
      this.setState({playerSummaries: result.response.players});
    }.bind(this));

    event.preventDefault();
  }

  getPlayerSummaries(steamids, cb) {
    fetch(`getPlayerSummary/?q=${steamids}`).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error ('Request failed!');
    }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
      cb(jsonResponse);
  })
  }

  render() {

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Match Status:
            <textarea value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>

        { this.state.playerSummaries.length > 0 &&
          <ul className="playersummaries">
            {this.state.playerSummaries.map((data) =>
              <li key={data.steamid}>
                <PlayerProfile playerSummary={data} listOfIds={this.state.steamids} />
              </li>
            )}
          </ul>
        }

      </div>

      );
  }

}

export default Status;
