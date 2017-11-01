import React from 'react';

class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.winPercentage = this.winPercentage.bind(this);
  }

  winPercentage() {
    let totalWins;
    let roundsPlayed;
    this.props.playerStats.forEach(function(stat) {
      if (stat.name === 'total_wins') {
        totalWins = stat.value;
      }
      if (stat.name === 'total_rounds_played') {
        roundsPlayed = stat.value;
      }
    });
    return Number(totalWins / roundsPlayed * 100).toPrecision(3);
  }

  render() {

    let utcSeconds = this.props.playerSummary.timecreated;
    let dateCreated = new Date(0);
    dateCreated.setUTCSeconds(utcSeconds);
    let betterDate = dateCreated.toLocaleDateString();

    return (

    <div>
      <p>Account created: {betterDate} </p>
      <p>Steamid64: {this.props.playerSummary.steamid}</p>
      <p>Steam play time on record:  {Math.floor(this.props.csgoplaytime.playtime_forever / 60)}h </p>
      <p>Actual time played:  {Math.floor(this.props.playerStats[2].value / 60 / 60)}h </p>
      <p>Headshot %: {Number(this.props.playerStats[25].value / this.props.playerStats[0].value).toPrecision(2) * 100} % </p>
      <p>Win %: { this.winPercentage() } %</p>
      <p>K/D: { Number(this.props.playerStats[0].value / this.props.playerStats[1].value).toPrecision(3) } </p>
    </div>
      );
  }
}

export default Stats;
