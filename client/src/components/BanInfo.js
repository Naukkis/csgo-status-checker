import React from 'react';

const banInfo = (props) => {
  return (
    <div>
      {props.VACBanned ?
        (
          <div>
            <p style={{ color: 'red' }}>VAC BANNED</p>
            <p style={{ color: 'red' }}>Number of VAC bans: {props.NumberOfVACBans} </p>
            <p style={{ color: 'red' }}>Days since last ban: {props.DaysSinceLastBan} </p>
          </div>
        ) :
        <p style={{ color: 'green' }}>No VAC bans on record</p>}
      <p>Number of Game Bans: {props.NumberOfGameBans}</p>
    </div>
  )
}

export default banInfo;