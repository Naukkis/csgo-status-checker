import React from 'react';
import axios from 'axios';

class AddMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: '',
      teamScore: 0,
      opponentScore: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleSubmit() {
    axios.post('/database/add-match', {
      playerIDs: this.state.ids,
      teamScore: `${this.state.teamScore} - {$this.state.opponentScore}`,
    })
      .then()
      .catch();
  }

  render() {
    return (
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
      </form>);
  }
}

export default AddMatch;
