import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { dateFormat } from '../utils/dateFormat';

class PreviousMatches extends React.Component {
  constructor(props) {
    super(props);
    this.state = { matches: [] };
  }
  componentWillMount() {
    console.log(this.props.previouslyPlayedWith);
    const params = this.props.previouslyPlayedWith.map(x => x.match_id).join(',');
    if (params) {
      axios.get(`/api/matches/info?q=${params}`)
        .then((res) => {
          res.data.data.forEach((matchData) => {
            axios.get(`/api/players-from-match/?q=${matchData.match_id}`)
              .then((response) => {
                const match = matchData;
                match.team1 = response.data.team1;
                match.team2 = response.data.team2;
                const tempState = this.state.matches;
                tempState.push(match);
                this.setState({ matches: [...tempState] });
              })
              .catch(err => console.log(err));
          });
        })
        .catch(err => console.log(err));
    }

  }

  render() {
    const linkProps = (x) => {
      return {
        pathname: `/matches/${x.match_id}`,
        state: {
          matchID: x.match_id,
          team1: x.team1,
          team2: x.team2,
          addedAt: x.added_at,
          map: x.map_played,
          teamScore: x.team_score,
          opponentScore: x.opponent_score,
        },
      };
    };

    if (this.props.previouslyPlayedWith.length < 1) {
      return null;
    }
    return (
      <div>
        <p>You have added the player previously on: </p>
        {this.state.matches.map((x) => {
          return (
            <Link
              to={linkProps(x)}
              href={`/matches/${x.match_id}`}
              key={x.match_id}
            >
              <p>{dateFormat(x.added_at)}</p>
            </Link>)
        })}
      </div>
    )
  }
}
export default PreviousMatches;