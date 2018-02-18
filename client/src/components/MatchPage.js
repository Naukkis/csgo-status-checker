import React from 'react';

export default class MatchPage extends React.Component {
  render(){
    return (
      <ul>
        <li> {this.props.teammates} </li>
        <li> {this.props.opponents} </li>
        <li> {this.props.added_at}</li>
      </ul>
    )
  }
}