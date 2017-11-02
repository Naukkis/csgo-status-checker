import React from 'react';

class OperationMaps extends React.Component {

  render () {
    return (
    <div>
      {this.props.mapStats.Rows.length > 0 &&
        <p>{this.props.mapStats.Rows[0]}</p>
      }
    </div>
  );
  }
}

export default OperationMaps;
