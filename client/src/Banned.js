import React from 'react';

class Banned extends React.Component {
  render () {
    return (
    <div>
      <p>Banned friends: {this.props.bannedFriends}</p>
    </div>
  );
  }
}

export default Banned;
