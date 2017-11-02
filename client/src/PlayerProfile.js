import React from 'react';
import Stats from './Stats';
import Banned from './Banned';
import axios from 'axios';

class PlayerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerStats: [],
      bannedFriends: 0,
      friends: [],
      CSGOPlaytime: {},
      banStatus: {}
    }
    this.getPlayerStats = this.getPlayerStats.bind(this);
    this.getFriendsList = this.getFriendsList.bind(this);
    this.countBannedFriends = this.countBannedFriends.bind(this);
    this.checkWhoAreFriends = this.checkWhoAreFriends.bind(this);
    this.getCSGOPlayTime = this.getCSGOPlayTime.bind(this);
    this.getBanStatus = this.getBanStatus.bind(this);

    this.getBanStatus(this.props.playerSummary.steamid);

    if (this.props.playerSummary.communityvisibilitystate === 3) {
      this.getPlayerStats(this.props.playerSummary.steamid);
      this.getCSGOPlayTime(this.props.playerSummary.steamid);
      this.getFriendsList(this.props.playerSummary.steamid, this.countBannedFriends, this.checkWhoAreFriends);
    }
  }

  getBanStatus(steamid) {
    axios.get(`banStatus/?q=${steamid}`)
      .then(response => {
        this.setState({banStatus: response.data.players[0]})
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getFriendsList(steamid, countBannedFriends, checkWhoAreFriends) {
    axios.get(`getBanned/?q=${steamid}`)
      .then(response => {
        countBannedFriends(response.data);
        checkWhoAreFriends(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  countBannedFriends(friendsList) {
    let bannedFriends = 0;
    friendsList.forEach(function(player) {
        if (player.VACBanned || player.CommunityBanned || player.NumberOfGameBans > 0) {
          bannedFriends += 1;
        }
    });
    this.setState({ bannedFriends: bannedFriends});
  }

  checkWhoAreFriends(friendsList) {
    let friends = [];
    let nickQuery = '';
    let compare = this.props.listOfIds;
    friendsList.forEach(function(player) {
      compare.forEach(function(id) {
        if (id === player.SteamId) {
          nickQuery += player.SteamId + ',';
        }
      });
    });
    axios.get('getPlayerSummary/?q=' + nickQuery)
      .then((response) => {
        response.data.response.players.forEach((player) => {
          friends.push(player.personaname);
        })
        this.setState({friends: friends});
      })
      .catch (function(error) {
        console.log(error);
      });

  }

  getPlayerStats(steamid) {
    axios.get(`getPlayerStats/?q=${steamid}`)
      .then(response => {
        this.setState({playerStats: response.data.playerstats.stats});
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getCSGOPlayTime(steamid) {
    axios.get(`ownedGames/?q=${steamid}`)
      .then(response => {
        this.setState({CSGOPlaytime: response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let profileurl = 'http://steamcommunity.com/profiles/' + this.props.playerSummary.steamid;
    return (
    <div>
      <a target="_blank" href={profileurl}> <h1>{this.props.playerSummary.personaname}</h1>
        <img src={this.props.playerSummary.avatarmedium}
          alt="avatar"
        />
        <div>
          <div>{this.state.banStatus.VACBanned ? (
            <div style={{color: 'red'}}>
              <p>VAC BANNED</p>
              <p>Number of VAC bans: {this.state.banStatus.NumberOfVACBans} </p>
              <p>Days since last ban: {this.state.banStatus.DaysSinceLastBan} </p>
            </div>
          ) : <p style={{color: 'green'}}>No VAC bans on record</p> }</div>
          <p>Number of Game Bans: {this.state.banStatus.NumberOfGameBans}</p>
        </div>
        <div>
          {this.state.playerStats.length > 0 ?
            (
              <div>
                <Stats playerSummary={this.props.playerSummary} playerStats={this.state.playerStats} csgoplaytime={this.state.CSGOPlaytime}/>
                <Banned bannedFriends={this.state.bannedFriends} />
                <p>Friends with:</p>
                <ul className='friendsWith'>
                  {this.state.friends.map((friend) =>
                    <li key={friend}>
                      {friend}
                    </li>
                  )}
                </ul>
              </div>
            ) :
            <p>Private Profile</p>
          }
        </div>
      </a>
    </div>
  );
  }
}
export default PlayerProfile;
