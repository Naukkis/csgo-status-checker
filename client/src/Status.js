import React from 'react';
import { steamidTo64 } from "./SteamIdConverter";
import PlayerProfile from "./PlayerProfile";
const axios = require('axios');

class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '',
                  playerSummaries: [],
                  playerStats: [],
                  recentlyPlayedCSGO: {},
                  steamids: [],
                  operationMaps: []
                };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getOperationMapStats = this.getOperationMapStats.bind(this);
    this.getPlayerSummaries = this.getPlayerSummaries.bind(this);
    this.getOperationMapStats();
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

  getOperationMapStats() {
    axios.get(`/operationMaps`)
      .then(response => {
        this.setState({operationMaps: response.data.result});
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {

    return (
      <div>
        { this.state.operationMaps.Rows &&
          <div id="operationMaps" style={{position: 'absolute', top: 10}}>
            <p> {this.state.operationMaps.Rows[0][1]} </p>
            <p> {this.state.operationMaps.Rows[0][2].toPrecision(2)} %</p>

            <p> {this.state.operationMaps.Rows[1][1]} </p>
            <p> {this.state.operationMaps.Rows[1][2].toPrecision(2)} %</p>

            <p> {this.state.operationMaps.Rows[2][1]} </p>
            <p> {this.state.operationMaps.Rows[2][2].toPrecision(2)} %</p>

            <p> {this.state.operationMaps.Rows[3][1]} </p>
            <p> {this.state.operationMaps.Rows[3][2].toPrecision(2)} %</p>

            <p> {this.state.operationMaps.Rows[4][1]} </p>
            <p> {this.state.operationMaps.Rows[4][2].toPrecision(2)} %</p>

            <p> {this.state.operationMaps.Rows[5][1]} </p>
            <p> {this.state.operationMaps.Rows[5][2].toPrecision(2)} %</p>

            <p> {this.state.operationMaps.Rows[6][1]} </p>
            <p> {this.state.operationMaps.Rows[6][2].toPrecision(2)} %</p>
          </div>
        }
        <form onSubmit={this.handleSubmit}>
          <label>
            Match Status / Steam ID:
          </label>
          <textarea value={this.state.value} onChange={this.handleChange} />

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
