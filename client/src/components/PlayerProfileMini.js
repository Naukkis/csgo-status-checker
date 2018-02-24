import React from 'react';
import PropTypes from 'prop-types';


class PlayerProfileMini extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '', banStatus: {},
    };
    this.handleChange = this.handleChange.bind(this);
  }
/*
  componentWillMount() {
    console.log(this.props.banStatus);
    this.setState({ banStatus: this.props.banStatus.filter(player => player.SteamId === this.props.playerSummary.steamid) });
  }
*/
  handleChange(e) {
    this.setState({ comment: e.target.value });
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
            <div style={{ color: 'red' }}>
              <p>VAC BANNED</p>
              <p>Number of VAC bans: {NumberOfVACBans} </p>
              <p>Days since last ban: {DaysSinceLastBan} </p>
            </div>
          ) :
            <p style={{ color: 'green' }}>No VAC bans on record</p> }
          <p style={gamebanStyle}>Game Bans: {NumberOfGameBans}</p>
          <input type="text" value={this.state.comment} onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}

PlayerProfileMini.propTypes = {
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
};

export default PlayerProfileMini;
