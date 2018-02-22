import React from 'react';
import axios from 'axios';

class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = { matches: [] };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    axios.get('/database/matches/?q=abSuErYDyvAWY2k1')
      .then((res) => {
        console.log(res.data.data);
        this.setState({ matches: res.data.data });
      })
      .catch(err => console.log(err));
  }

  handleClick(e) {
    console.log(e.target);
  }

  render() {
    const date = addedAt => new Date(addedAt).toLocaleDateString();

    const { matches } = this.state;
    // <MatchPage key={`match_${x.match_id}`} teammates={x.team_mates} opponents={x.opponent_players} added_at={x.added_at} />
    return (
      <div>
      <table className="matches">
        <thead>
              <tr>
                <th>Date</th>
                <th>Map</th>
                <th>Score</th>
                <th>Bans</th>
              </tr>
            </thead>
            <tbody>

              { matches.map(x =>
            <tr key={`row_${x.match_id}`} onClick={this.handleClick}>
              <td>{date(x.added_at)}</td>
              <td>{x.map_played}</td>
              <td>{x.team_score} - {x.opponent_score}</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    );
  }
}
export default Matches;
