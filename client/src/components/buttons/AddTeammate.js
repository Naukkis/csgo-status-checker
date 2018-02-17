import React from 'react';
import PropTypes from 'prop-types';

const addTeammate = props => (
  <button
    className="teammate"
    id={props.steamid}
    onClick={props.onClick}
  >
    Your team
  </button>);

addTeammate.propTypes = {
  steamid: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
export default addTeammate;
