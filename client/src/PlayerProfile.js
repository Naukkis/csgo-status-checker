import React from 'react';
import Stats from './Stats';
import Banned from './Banned';
import axios from 'axios';

class PlayerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerStats: [],
      recentlyPlayedCSGO: {},
      bannedFriends: 0,
      friends: [],
      color: 'grey'
    }
    this.getPlayerStats = this.getPlayerStats.bind(this);
    this.getRecentlyPlayedCSGO = this.getRecentlyPlayedCSGO.bind(this);
    this.getFriendsList = this.getFriendsList.bind(this);
    this.countBannedFriends = this.countBannedFriends.bind(this);
    this.checkWhoAreFriends = this.checkWhoAreFriends.bind(this);

    if (this.props.playerSummary.communityvisibilitystate === 3) {
      this.getPlayerStats(this.props.playerSummary.steamid);
      this.getRecentlyPlayedCSGO(this.props.playerSummary.steamid);
      this.getFriendsList(this.props.playerSummary.steamid, this.countBannedFriends, this.checkWhoAreFriends);
    }
  }

  getFriendsList(steamid, countBannedFriends, checkWhoAreFriends) {
    fetch(`getBanned/?q=${steamid}`).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error ('Request failed!');
    }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
      countBannedFriends(jsonResponse);
      checkWhoAreFriends(jsonResponse);
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

// TODO: merkkaa friendsit jotenki
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
    fetch(`getPlayerStats/?q=${steamid}`).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error ('Request failed!');
    }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
       this.setState({playerStats: jsonResponse.playerstats.stats});
  })
  }

  getRecentlyPlayedCSGO(steamid) {
    fetch(`recentlyPlayedGames/?q=${steamid}`).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error ('Request failed!');
      }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        let recently;
        if (jsonResponse.response.games === undefined) {
          recently = 'private profile';
        } else {
          recently = jsonResponse.response.games[0];
        }
       this.setState({recentlyPlayedCSGO: recently});
     })
  }

  render() {
    return (
    <div>
      <h1 >{this.props.playerSummary.personaname}</h1>
      <img src={this.props.playerSummary.avatarmedium}
        alt="avatar"
      />
      <div>
        {this.state.playerStats.length > 0 ?
          (
            <div>
              <Stats playerSummary={this.props.playerSummary} playerStats={this.state.playerStats} recentlyPlayedCSGO={this.state.recentlyPlayedCSGO} color={this.state.color}/>
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
          (<p>Private Profile</p>)
        }
      </div>
    </div>
  );
  }
}
export default PlayerProfile;
