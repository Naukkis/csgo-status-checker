import React from 'react';
import PropTypes from 'prop-types';

const BannedFriends = props => (
  props.bannedFriends > 0 ?
    <p style={{ color: 'red' }}>Banned friends: {props.bannedFriends}</p>
    :
    <p>Banned friends: {props.bannedFriends}</p>
);

BannedFriends.propTypes = {
  bannedFriends: PropTypes.number.isRequired,
};

export default BannedFriends;
