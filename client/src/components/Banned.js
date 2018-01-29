import React from 'react';

function Banned(props) {
  return (
    <div>
      {props.bannedFriends > 0 ?
        <p style={{ color: 'red' }}>Banned friends: {props.bannedFriends}</p>
      :
        <p>Banned friends: {props.bannedFriends}</p>}
    </div>
  );
}

Banned.propTypes = {
  bannedFriends: React.PropTypes.number.isRequired,
};
export default Banned;
