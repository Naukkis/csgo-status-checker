import React from 'react';
import axios from 'axios';
import findSteamID from '../utils/SteamIdConverter';

class AddMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: '',
      teamScore: 0,
      opponentScore: 0,
      players: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const listOfIds = findSteamID(this.state.ids);
    this.setState({ players: [...listOfIds.arr] });
    axios.post('/database/add-match', {
      playerIDs: listOfIds.query,
      teamScore: this.state.teamScore,
      opponentScore: this.state.opponentScore,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <textarea id="ids" value={this.state.ids} onChange={this.handleChange} />
        <input
          id="teamScore"
          type="number"
          value={this.state.teamScore}
          onChange={this.handleChange}
        />
        <input
          id="opponentScore"
          type="number"
          value={this.state.opponentScore}
          onChange={this.handleChange}
        />
        <input type="submit" value="Submit" />
      </form>
      { this.state.players.length > 0 &&  <MatchPage players={this.state.players} />}
      </div>);
  }
}

export default AddMatch;
