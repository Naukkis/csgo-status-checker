import React from 'react';

const MapSelector = props => (
    <form>
      <select id="map" onChange={props.onChange} >
        <option value="empty">Map played</option>
        <option value="cs_office">cs_office</option>
        <option value="cs_agency">cs_agency</option>
        <option value="cs_militia">cs_rip_militia</option>
      </select>
    </form>);

export default MapSelector;