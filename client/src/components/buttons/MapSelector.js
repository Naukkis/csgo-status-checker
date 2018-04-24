import React from 'react';

const MapSelector = props => (
  <form>
    <select id="map" onChange={props.onChange} value={props.map}>
      <option value="cs_agency">cs_agency</option>
      <option value="cs_office">cs_office</option>
      <option value="de_cache">de_cache</option>
      <option value="de_canals">de_canals</option>
      <option value="de_dust2">de_dust2</option>
      <option value="de_inferno">de_inferno</option>
      <option value="de_mirage">de_mirage</option>
      <option value="de_nuke">de_nuke</option>
      <option value="de_overpass">de_overpass</option>
      <option value="de_train">de_train</option>
    </select>
  </form>);

export default MapSelector;