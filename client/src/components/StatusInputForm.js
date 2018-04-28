import React from 'react';

const StatusInputForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <label htmlFor="status">
        When in a CS:GO match, type &apos;status&apos; to console. Paste the result here.
        Single SteamIDs or Steam64IDs work as well.
        <textarea id="status" value={props.value} onChange={props.handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>)
}

export default StatusInputForm;
