import React from 'react';

class Banned extends React.Component {
  render () {
    return (
    <div>
      {this.props.bannedFriends > 0 ?
        <p style={{color: 'red'}}>Banned friends: {this.props.bannedFriends}</p>
      :
      <p>Banned friends: {this.props.bannedFriends}</p>}
    </div>
  );
  }
}

export default Banned;
