import React from 'react';
import axios from 'axios';
import MatchTable from './MatchTable';
import hasBeenBanned from '../utils/hasBeenBanned';

function compareDecending(a, b){
  if (a.match_id < b.match_id){
    return 1;
  }
  if (a.match_id > b.match_id) {
    return -1;
  }
  return 0;
}

class MatchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { matches: [] };
  }

  componentWillMount() {
    const userID = localStorage.getItem('userID');
    if (userID !== 'undefined') {
      axios.get(`/database/matches/?q=${userID}`)
        .then((res) => {
          res.data.data.forEach((matchData) => {
            axios.get(`/database/players-from-match/?q=${matchData.match_id}`)
              .then((response) => {
                const match = matchData;
                match.team1 = response.data.team1;
                match.team2 = response.data.team2;
                match.bannedPlayers = response.data.playerBans.filter((player) => hasBeenBanned(player));
                const tempState = this.state.matches;
                tempState.push(match);
                tempState.sort(compareDecending);
                this.setState({ matches: [...tempState] });
              })
              .catch(err => console.log(err));
          });
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <MatchTable matches={this.state.matches} />
    );
  }
}

export default MatchContainer;
