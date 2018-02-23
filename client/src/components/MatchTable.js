import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from '../utils/dateFormat';
import Teams from './Teams';

class MatchTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { display: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    e.preventDefault();
    console.log(e)
    const current = this.state.display;
    this.setState({ display: !current });
  }

  render() {
    return (
      <table className="matches">
        <thead>
          <tr>
            <th>Date</th>
            <th>Map</th>
            <th>Score</th>
            <th>Your team</th>
            <th>Opponents</th>
          </tr>
        </thead>
        <tbody>
          { this.props.matches.map(x =>
        (
          <tr id={x.match_id} key={`row_${x.match_id}`} onClick={this.handleClick}>
            <td>{dateFormat(x.added_at)}</td>
            <td>{x.map_played}</td>
            <td>{x.team_score} - {x.opponent_score}</td>
            <Teams display={this.state.display} players={x.team1} />
            <Teams display={this.state.display} players={x.team2} />
          </tr>
        ))}
         
        </tbody>
      </table>);
  }
}


export default MatchTable;

MatchTable.propTypes = {
  matches: PropTypes.array.isRequired,
};
