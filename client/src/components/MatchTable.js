import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { dateFormat, countDaysSinceToday } from '../utils/dateFormat';
import cs_agency from '../static/img/maps/cs_agency.jpg';
import cs_office from '../static/img/maps/cs_office.jpg';
import de_cache from '../static/img/maps/de_cache.jpg';
import de_canals from '../static/img/maps/de_canals.jpg';
import de_cbble from '../static/img/maps/de_cbble.jpg';
import de_dust2 from '../static/img/maps/de_dust2.jpg';
import de_inferno from '../static/img/maps/de_inferno.jpg';
import de_mirage from '../static/img/maps/de_mirage.jpg';
import de_nuke from '../static/img/maps/de_nuke.jpg';
import de_overpass from '../static/img/maps/de_overpass.jpg';
import de_train from '../static/img/maps/de_train.jpg';

class MatchTable extends React.Component {
  render() {
    const bannedAt = (addedAt, daysSinceLastBan) => {
      let difference = countDaysSinceToday(addedAt) - daysSinceLastBan;
      if (difference > 0) {
        difference *= -1;
        return `Someone banned ${difference} days after the match`;
      }
      difference *= -1;
      return `Someone banned ${difference} days before the match`;
    };

    const mapImage = (map) => {
      let mapImg = null;
      switch (map) {
        case 'cs_agency':
          mapImg = cs_agency;
          break;
        case 'cs_office':
          mapImg = cs_office;
          break;
        case 'de_cache':
          mapImg = de_cache;
          break;
        case 'de_canals':
          mapImg = de_canals;
          break;
        case 'de_cbble':
          mapImg = de_cbble;
          break;
        case 'de_dust2':
          mapImg = de_dust2;
          break;
        case 'de_inferno':
          mapImg = de_inferno;
          break;
        case 'de_mirage':
          mapImg = de_mirage;
          break;
        case 'de_nuke':
          mapImg = de_nuke;
          break;
        case 'de_overpass':
          mapImg = de_overpass;
          break;
        case 'de_train':
          mapImg = de_train;
          break;
        default:
          mapImg = null;
      }
      return mapImg;
    };

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

    return (
      <table className="matches">
        <thead>
          <tr>
            <th>Date</th>
            <th>Map</th>
            <th colSpan="2">Score</th>
            <th>Bans</th>
          </tr>
        </thead>
        <tbody>
          { this.props.matches.map(x =>
        (
          <tr id={x.match_id} key={`row_${x.match_id}`}>
            <td>
              <Link
                to={linkProps(x)}
                key={x.match_id}
              >
                { dateFormat(x.added_at)}
              </Link>
            </td>
            <td>
              <Link
                to={linkProps(x)}
                key={x.match_id}
              >
                <img src={ mapImage(x.map_played) } alt={x.map_played} />
              </Link>
            </td>
            <td>{x.team_score}</td>
            <td>{x.opponent_score}</td>
            {x.bannedPlayers.length > 0 &&
              <td>{ bannedAt(x.added_at, x.bannedPlayers[0].DaysSinceLastBan) }</td> }
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
