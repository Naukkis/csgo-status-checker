import React from 'react';
import PropTypes from 'prop-types';
import apiCalls from '../utils/apiCalls';

class PlayerProfileMini extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      banStatus: {},
    };
  }

  componentDidMount() {
    const { steamid } = this.props.playerSummary;
    apiCalls.banStatus(steamid, data => this.setState({ banStatus: data }));
  }

  render() {
    const profileurl = `http://steamcommunity.com/profiles/ ${this.props.playerSummary.steamid}`;
    const divStyle = {
      width: 300,
    };
    const gamebanStyle = {
      color: this.state.banStatus.NumberOfGameBans > 0 ? 'red' : 'green',
    }

    return (
      <div style={divStyle}>
        <a target="_blank" href={profileurl}> 
          <h6 >{this.props.playerSummary.personaname}</h6>
        </a>
        <div>
          {this.state.banStatus.VACBanned ?
          (
            <div style={{ color: 'red' }}>
              <p>VAC BANNED</p>
              <p>Number of VAC bans: {this.state.banStatus.NumberOfVACBans} </p>
              <p>Days since last ban: {this.state.banStatus.DaysSinceLastBan} </p>
            </div>
          ) :
            <p style={{ color: 'green' }}>No VAC bans on record</p> }
          <p style={gamebanStyle}>Game Bans: {this.state.banStatus.NumberOfGameBans}</p>

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
};

export default PlayerProfileMini;
