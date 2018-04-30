import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Stats from './Stats';
import BannedFriends from './BannedFriends';
import { playerStats, CSGOPlayTime, getPlayerBansOnFriendList } from '../utils/apiCalls';
import { checkWhoAreFriends, countBannedFriends } from '../utils/utils';
import PreviousMatches from './PreviousMatches';
import BanInfo from './BanInfo';

class PlayerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerStats: [],
      numberOfBannedFriends: 0,
      friendsInMatch: [],
      comment: this.props.comment || '',
      CSGOPlaytime: {},
      commentSaved: false,
    };
  }

  async componentDidMount() {
    const { steamid } = this.props.summary;
    const publicProfile = this.props.summary.communityvisibilitystate;
    // with old privacy settings 3 == public profile, but it doesn't apply to game stats anymore
    if (publicProfile === 3) {
      playerStats(steamid, data => this.setState({ playerStats: data }));
      CSGOPlayTime(steamid, data => this.setState({ CSGOPlaytime: data }));
      const friendBanStatuses = await getPlayerBansOnFriendList(steamid);
      // people with >100 friends are returned in list of lists, must be flatten
      const flattenedFriendList = friendBanStatuses.reduce((prev, curr) => prev.concat(curr));
      const friendsInMatch = checkWhoAreFriends(flattenedFriendList, this.props.playerSummaries);
      const numberOfBannedFriends = countBannedFriends(flattenedFriendList);
      this.setState({ friendsInMatch, numberOfBannedFriends });
    }
  }

  handleChange = (e) => {
    this.setState({ comment: e.target.value });
  }

  save = () => {
    axios.put('/api/matches/add-comment', {
      matchID: this.props.matchID,
      steamid64: this.props.summary.steamid,
      comment: this.state.comment,
    })
      .then((response) => {
        if (response.data.status === "success") {
          this.setState({ commentSaved: true });
          setTimeout(() => {
            this.setState({ commentSaved: false });
          }, 5000);
        }
      })
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
        {this.props.matchID &&
          <div>
            <input type="text" value={this.state.comment} onChange={this.handleChange} />
            <button onClick={this.save}>Save</button>
            {this.state.commentSaved && <p style={{ borderStyle: 'solid', borderColor: 'green' }}>Comment saved</p>}
          </div>
        }
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

              </div>
            ) :
            <p>Private Profile</p>
          }
          <BannedFriends bannedFriends={this.state.numberOfBannedFriends} />
          <p>Friends with:</p>
          <ul className="friendsWith">
            {this.state.friendsInMatch.map(friend =>
              <li key={friend}> {friend} </li>)}
          </ul>
        </div>
        {this.props.previouslyPlayedWith &&
          <PreviousMatches
            previouslyPlayedWith={this.props.previouslyPlayedWith}
            matches={this.props.matches}
          />
        }
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
  banInfo: PropTypes.object.isRequired,
  comment: PropTypes.string,
  matches: PropTypes.array,
  playerSummaries: PropTypes.arrayOf(PropTypes.object).isRequired,
  matchID: PropTypes.number,
  children: PropTypes.element,
};

PlayerProfile.defaultProps = {
  matches: [],
  comment: '',
  previouslyPlayedWith: [],
  matchID: 0,
  children: null,
};

export default PlayerProfile;
