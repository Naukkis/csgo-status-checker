import React from 'react';
import PropTypes from 'prop-types';

class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.winPercentage = this.winPercentage.bind(this);
    this.HSPercentage = this.HSPercentage.bind(this);
  }

  winPercentage() {
    let totalWins;
    let roundsPlayed;
    this.props.playerStats.forEach((stat) => {
      if (stat.name === 'total_wins') {
        totalWins = stat.value;
      }
      if (stat.name === 'total_rounds_played') {
        roundsPlayed = stat.value;
      }
    });
    return Number((totalWins / roundsPlayed) * 100).toPrecision(3);
  }

  HSPercentage() {
    let totalKills;
    let totalKillsHeadshot;
    this.props.playerStats.forEach((stat) => {
      if (stat.name === 'total_kills') {
        totalKills = parseInt(stat.value, 10);
      }
      if (stat.name === 'total_kills_headshot') {
        totalKillsHeadshot = parseInt(stat.value, 10);
      }
    });
    console.log();
    return Number((totalKillsHeadshot / totalKills) * 100).toPrecision(2);
  }

  render() {
    const utcSeconds = this.props.summary.timecreated;
    const dateCreated = new Date(0);
    dateCreated.setUTCSeconds(utcSeconds);
    const betterDate = dateCreated.toLocaleDateString();

    return (
      <div className="stats">
        <p>Account created: {betterDate} </p>
        <p>Steamid64: {this.props.summary.steamid}</p>
        <p>Steam play time on record:
          {Math.floor(this.props.csgoplaytime.playtime_forever / 60)}h
        </p>
        <p>Actual time played:  {Math.floor(this.props.playerStats[2].value / 60 / 60)}h </p>
        <p>Headshot %: { this.HSPercentage() } % </p>
        <p>Win %: { this.winPercentage() } %</p>
        <p>
          K/D: { Number(this.props.playerStats[0].value / this.props.playerStats[1].value)
                 .toPrecision(3) }
        </p>
      </div>
    );
  }
}

Stats.propTypes = {
  summary: PropTypes.object.isRequired, // eslint-disable-line
  csgoplaytime: PropTypes.shape({ playtime_forever: '' }).isRequired,
  playerStats: PropTypes.array, // eslint-disable-line
};

export default Stats;
