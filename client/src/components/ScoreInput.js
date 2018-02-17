import React from 'react';

const ScoreInput = props => (
  <input
    id={props.id}
    type="number"
    onChange={props.onChange}
  />
  )

export default ScoreInput;