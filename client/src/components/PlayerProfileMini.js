import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class PlayerProfileMini extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.comment || '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
  }

  handleChange(e) {
    this.setState({ comment: e.target.value });
  }

  save() {
    axios.put('/database/matches/add-comment', {
      matchID: this.props.matchID,
      steamid64: this.props.playerSummary.steamid,
      comment: this.state.comment,
    })
    .then(response => console.log(response.data))
    .catch(error => console.log(error));
  }

  render() {
    const { NumberOfVACBans, DaysSinceLastBan, NumberOfGameBans, VACBanned } = this.props.banInfo;
    const profileurl = `http://steamcommunity.com/profiles/${this.props.playerSummary.steamid}`;
    const divStyle = {
      width: 300,
    };
    const gamebanStyle = {
      color: NumberOfGameBans > 0 ? 'red' : 'green',
    };

    return (
      <div style={divStyle}>
        <a target="_blank" href={profileurl}>
          <h6 >{this.props.playerSummary.personaname}</h6>
        </a>
        <div>
          {VACBanned ?
          (
            <div>
              <p style={{ color: 'red' }}>VAC BANNED</p>
              <p style={{ color: 'red' }}>Number of VAC bans: {NumberOfVACBans} </p>
              <p style={{ color: 'red' }}>Days since last ban: {DaysSinceLastBan} </p>
            </div>
          ) :
            <p style={{ color: 'green' }}>No VAC bans on record</p> }
          <p style={gamebanStyle}>Game Bans: {NumberOfGameBans}</p>
          <input type="text" value={this.state.comment} onChange={this.handleChange} />
          <button onClick={this.save}>Save</button>
        </div>
      </div>
    );
  }
}

PlayerProfileMini.propTypes = {
  matchID: PropTypes.number.isRequired,
  playerSummary: PropTypes.shape({
    steamid: '',
    personaname: '',
    avatarmedium: '',
  }).isRequired,
  banInfo: PropTypes.shape({
    VACBanned: PropTypes.bool,
    NumberOfVACBans: PropTypes.number,
    NumberOfGameBans: PropTypes.number,
    DaysSinceLastBan: PropTypes.Number,
  }).isRequired,
  comment: PropTypes.string,
};

PlayerProfileMini.defaultProps = {
  comment: '',
};

export default PlayerProfileMini;
