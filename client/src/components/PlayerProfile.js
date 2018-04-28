import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Stats from './Stats';
import BannedFriends from './BannedFriends';
import apiCalls from '../utils/apiCalls';
import PreviousMatches from './PreviousMatches';
import BanInfo from './BanInfo';

class PlayerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerStats: [],
      bannedFriends: 0,
      friends: [],
      CSGOPlaytime: {},
    };
  }

  async componentDidMount() {
    const { steamid } = this.props.summary;
    const playerIDsFromMatch = this.props.listOfIds;
    const publicProfile = this.props.summary.communityvisibilitystate;
    // with old privacy settings 3 == public profile, but it doesn't apply to game stats anymore
    if (publicProfile === 3) {
      apiCalls.playerStats(steamid, data => this.setState({ playerStats: data }));
      apiCalls.CSGOPlayTime(steamid, data => this.setState({ CSGOPlaytime: data }));
      const banStatuses = await apiCalls.getPlayerBansOnFriendList(steamid);
      apiCalls.checkWhoAreFriends(banStatuses, playerIDsFromMatch, (friendNames, bannedFriends) => {
        this.setState({ friends: friendNames, bannedFriends });
      });
    }
    console.log(this.props);
  }

  save = () => {
    axios.put('/api/matches/add-comment', {
      matchID: this.props.matchID,
      steamid64: this.props.summary.steamid,
      comment: this.state.comment,
    })
      .then(response => console.log(response.data))
      .catch(error => console.log(error));
  }

  render() {
    if (!this.props.summary) {
      return null;
    }

    const profileurl = `http://steamcommunity.com/profiles/ ${this.props.summary.steamid}`;
    return (
      <div>
        <a target="_blank" href={profileurl}> <h3 className="stats">{this.props.summary.personaname}</h3>
          <img
            src={this.props.summary.avatarmedium}
            alt="avatar"
          />
        </a>
        <a href={`https://csgo-stats.com/search/${this.props.summary.steamid}`} target="_blank">CS:GO-Stats.com</a>
        {this.props.children}
        <input type="text" value={this.state.comment} onChange={this.handleChange} />
        <button onClick={this.save}>Save</button>
        <BanInfo
          VACBanned={this.props.banInfo.VACBanned}
          NumberOfVACBans={this.props.banInfo.NumberOfVACBans}
          DaysSinceLastBan={this.props.banInfo.DaysSinceLastBan}
          NumberOfGameBans={this.props.banInfo.NumberOfGameBans}
        />
        <div>
          {this.state.playerStats.length > 0 ?
            (
              <div>
                <Stats
                  summary={this.props.summary}
                  playerStats={this.state.playerStats}
                  csgoplaytime={this.state.CSGOPlaytime}
                />
                <BannedFriends bannedFriends={this.state.bannedFriends} />
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
        {this.props.previouslyPlayedWith &&
          <PreviousMatches previouslyPlayedWith={this.props.previouslyPlayedWith} matches={this.props.matches} />}

      </div>
    );
  }
}

PlayerProfile.propTypes = {
  summary: PropTypes.shape({
    timeCreated: '',
    steamid: '',
    personaname: '',
    avatarmedium: '',
    communityvisibilitystate: '',
  }).isRequired,
  previouslyPlayedWith: PropTypes.array,
  listOfIds: PropTypes.array.isRequired,
  banInfo: PropTypes.object,
  comment: PropTypes.string,
  matches: PropTypes.array, 
};

PlayerProfile.defaultProps = {
  matches: [],
  comment: '',
  previouslyPlayedWith: [],
};

export default PlayerProfile;
