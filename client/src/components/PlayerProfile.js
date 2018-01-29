import React from 'react';
import PropTypes from 'prop-types';
import Stats from './Stats';
import Banned from './Banned';
import apiCalls from '../utils/apiCalls';

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

    const { steamid } = this.props.playerSummary;
    const idsToCompare = this.props.listOfIds;

    apiCalls.banStatus(steamid, data => this.setState({ banStatus: data }));
    if (this.props.playerSummary.communityvisibilitystate === 3) {
      apiCalls.playerStats(steamid, data => this.setState({ playerStats: data }));
      apiCalls.CSGOPlayTime(steamid, data => this.setState({ CSGOPlaytime: data }));
      apiCalls.friendsList(steamid, idsToCompare, (friends, banned) => this.setState({
        friends,
        bannedFriends: banned,
      }));
    }
  }

  render() {
    const profileurl = `http://steamcommunity.com/profiles/ ${this.props.playerSummary.steamid}`;
    return (
      <div>
        <a target="_blank" href={profileurl}> <h1>{this.props.playerSummary.personaname}</h1>
          <img
            src={this.props.playerSummary.avatarmedium}
            alt="avatar"
          />
        </a>
        <div>
          <div>{this.state.banStatus.VACBanned ? (
            <div style={{ color: 'red' }}>
              <p>VAC BANNED</p>
              <p>Number of VAC bans: {this.state.banStatus.NumberOfVACBans} </p>
              <p>Days since last ban: {this.state.banStatus.DaysSinceLastBan} </p>
            </div>
            ) : <p style={{ color: 'green' }}>No VAC bans on record</p> }
          </div>
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
    timeCreated: '', steamid: '', personaname: '', avatarmedium: '', communityvisibilitystate: '',
  }).isRequired,
  listOfIds: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};
export default PlayerProfile;
