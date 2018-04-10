import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Stats from './Stats';
import BannedFriends from './BannedFriends';
import apiCalls from '../utils/apiCalls';
import PreviousMatches from './PreviousMatches';
import BanInfo from './BanInfo';

class PlayerProfile2 extends React.Component {
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
      const { steamid } = this.props.summary;
      const idsToCompare = this.props.listOfIds;
      const publicProfile = this.props.summary.communityvisibilitystate;
      if (publicProfile === 3) {
        apiCalls.playerStats(steamid, data => this.setState({ playerStats: data }));
        apiCalls.CSGOPlayTime(steamid, data => this.setState({ CSGOPlaytime: data }));
        apiCalls.bannedOnFriendsList(steamid, (data) => {
          apiCalls.checkWhoAreFriends(data, idsToCompare, (friendNames, bannedFriends) => {
            this.setState({ friends: friendNames, bannedFriends });
          }); 
        });
      }
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

    const bans = () => {
      if (this.props.banInfo) {
        return this.props.banInfo;
      } else {
        return this.state.banStatus;
      }
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
        { this.props.children }
        <input type="text" value={this.state.comment} onChange={this.handleChange} />
          <button onClick={this.save}>Save</button>
        <BanInfo
          VACBanned={bans.VACBanned}
          NumberOfVACBans={bans.NumberOfVACBans}
          DaysSinceLastBan={bans.DaysSinceLastBan}
          NumberOfGameBans={bans.NumberOfGameBans}
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
        { this.props.previouslyPlayedWith && 
        <PreviousMatches previouslyPlayedWith={this.props.previouslyPlayedWith} matches={this.props.matches} />}
        
      </div>
    );
  }
}

PlayerProfile2.propTypes = {
  summary: PropTypes.shape({
    timeCreated: '',
    steamid: '',
    personaname: '',
    avatarmedium: '',
    communityvisibilitystate: '',
  }).isRequired,
  banInfo: PropTypes.object,
  comment: PropTypes.string,
  matches: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

PlayerProfile2.defaultProps = {
  matches: [],
  comment: '',
};

export default PlayerProfile2;
