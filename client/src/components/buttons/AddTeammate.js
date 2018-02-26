import React from 'react';
import PropTypes from 'prop-types';

const addTeammate = props => (
  <button
    className="btn_Addteammate"
    id={props.steamid}
    onClick={props.onClick}
  >
    {props.text}
  </button>);

addTeammate.propTypes = {
  steamid: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};
export default addTeammate;
