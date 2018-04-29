import React from 'react';
import axios from 'axios';
import MatchTablePro from '../components/MatchTablePro';
import { hasBeenBanned } from '../utils/utils';

class MatchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { matches: [] };
  }

  componentWillMount() {
    const userID = localStorage.getItem('userID');
    if (userID !== 'undefined') {
      axios.get(`/api/matches/?q=${userID}`)
        .then((matches) => {
          matches.data.data.forEach((matchData) => {
            axios.get(`/api/players-from-match/?q=${matchData.match_id}`)
              .then((res) => {
                const match = matchData;
                match.team1 = res.data.team1;
                match.team2 = res.data.team2;
                match.bannedPlayers = res.data.playerBans.filter(player => hasBeenBanned(player));
                const tempState = this.state.matches;
                tempState.push(match);
                tempState.sort((a, b) => b.match_id - a.match_id);
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
      <MatchTablePro matches={this.state.matches} />
    );
  }
}

export default MatchContainer;
