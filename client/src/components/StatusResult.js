import React from 'react';
import PlayerProfile from './PlayerProfile';

class StatusResult extends React.Component {
  render() {
    return (
          <div className="flex-container">
            { this.props.playerSummaries.map(data =>
               <span className="item" key={data.steamid}>
                 <PlayerProfile playerSummary={data} listOfIds={this.props.steamids} />
               </span>) }
          </div>  )  
  }
}

export default StatusResult;