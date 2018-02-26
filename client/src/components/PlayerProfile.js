import React from 'react';
import PropTypes from 'prop-types';
import Stats from './Stats';
import Banned from './Banned';
import apiCalls from '../utils/apiCalls';
import AddTeammate from './buttons/AddTeammate';

class PlayerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerStats: [],
      bannedFriends: 0,
      friends: [],
      CSGOPlaytime: {},
      banStatus: {},
    };
  }

  componentDidMount() {
    const { steamid } = this.props.playerSummary;
    const idsToCompare = this.props.listOfIds;
    const publicProfile = this.props.playerSummary.communityvisibilitystate;
    apiCalls.banStatus(steamid, data => this.setState({ banStatus: data }));
    if (publicProfile === 3) {
      apiCalls.playerStats(steamid, data => this.setState({ playerStats: data }));
      apiCalls.CSGOPlayTime(steamid, data => this.setState({ CSGOPlaytime: data }));
      apiCalls.bannedFriendsList(steamid, (data) => {
        apiCalls.checkWhoAreFriends(data, idsToCompare, (friendNames, bannedFriends) => {
          this.setState({ friends: friendNames, bannedFriends });
        });
      });
    }
  }

  render() {
    const profileurl = `http://steamcommunity.com/profiles/ ${this.props.playerSummary.steamid}`;
    const divStyle = {
      minHeight: 500,
      backgroundColor: this.props.teammate ? '#eff1f4' : 'lightblue',
    };
    const teamSelector = {
      buttontext: this.props.teammate ?  'Add to your team' : 'Remove from your team',
    };

    return (
      <div style={divStyle} >
        <a target="_blank" href={profileurl}> <h3 className="stats">{this.props.playerSummary.personaname}</h3>
          <img
            src={this.props.playerSummary.avatarmedium}
            alt="avatar"
          />
        </a>
         <AddTeammate steamid={this.props.playerSummary.steamid} onClick={this.props.onClick} text={teamSelector.buttontext} />
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
          <p>Number of Game Bans: {this.state.banStatus.NumberOfGameBans}</p>
        </div>
        <div>
          {this.state.playerStats.length > 0 ?
          (
            <div>
              <Stats
                playerSummary={this.props.playerSummary}
                playerStats={this.state.playerStats}
                csgoplaytime={this.state.CSGOPlaytime}
              />
              <Banned bannedFriends={this.state.bannedFriends} />
                <p>Friends with:</p>
                <ul className="friendsWith">
                  {this.state.friends.map(friend =>
                    <li key={friend}> {friend} </li>)}
                </ul>
            </div>
          ) :
            <p>Private Profile</p>
            }
        </div>
      </div>
    );
  }
}

PlayerProfile.propTypes = {
  playerSummary: PropTypes.shape({
    timeCreated: '',
    steamid: '',
    personaname: '',
    avatarmedium: '',
    communityvisibilitystate: '',
  }).isRequired,
  listOfIds: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

PlayerProfile.defaultProps = {
  listOfIds: '',
};

export default PlayerProfile;
