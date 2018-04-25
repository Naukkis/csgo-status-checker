import React from 'react';
import cs_agency from '../static/img/maps/cs_agency.jpg';
import cs_office from '../static/img/maps/cs_office.jpg';
import de_cache from '../static/img/maps/de_cache.jpg';
import de_canals from '../static/img/maps/de_canals.jpg';
import de_cbble from '../static/img/maps/de_cbble.jpg';
import de_dust2 from '../static/img/maps/de_dust2.jpg';
import de_inferno from '../static/img/maps/de_inferno.jpg';
import de_mirage from '../static/img/maps/de_mirage.jpg';
import de_nuke from '../static/img/maps/de_nuke.jpg';
import de_overpass from '../static/img/maps/de_overpass.jpg';
import de_train from '../static/img/maps/de_train.jpg';


const MapPicker = (props) => {
    return (
      <form>
        <label htmlFor="cs_agency">
          <input type="radio" id="cs_agency" value="cs_agency" checked={props.selected === 'cs_agency'} onChange={props.onChange} />
          <img src={cs_agency} alt="cs_agency" />
        </label>
        <label htmlFor="cs_office">
          <input type="radio" id="cs_office" value="cs_office" checked={props.selected === 'cs_office'} onChange={props.onChange}/>
          <img src={cs_office} alt="cs_office" />
        </label>
        <label htmlFor="de_cache">
          <input type="radio" id="de_cache" value="de_cache" checked={props.selected === 'de_cache'} onChange={props.onChange}/>
          <img src={de_cache} alt="de_cache" />
        </label>
        <label htmlFor="de_canals">
          <input type="radio" id="de_canals" value="de_canals" checked={props.selected === 'de_canals'} onChange={props.onChange}/>
          <img src={de_canals} alt="de_canals" />
        </label>
        <label htmlFor="de_cbble">
          <input type="radio" id="de_cbble" value="de_cbble" checked={props.selected === 'de_cbble'} onChange={props.onChange}/>
          <img src={de_cbble} alt="de_cbble" />
        </label>
        <label htmlFor="de_dust2">
          <input type="radio" id="de_dust2" value="de_dust2" checked={props.selected === 'de_dust2'} onChange={props.onChange}/>
          <img src={de_dust2} alt="de_dust2" />
        </label>
        <label htmlFor="de_inferno">
          <input type="radio" id="de_inferno" value="de_inferno" checked={props.selected === 'de_inferno'} onChange={props.onChange}/>
          <img src={de_inferno} alt="de_inferno" />
        </label>
        <label htmlFor="de_mirage">
          <input type="radio" id="de_mirage" value="de_mirage" checked={props.selected === 'de_mirage'} onChange={props.onChange}/>
          <img src={de_mirage} alt="de_mirage" />
        </label>
        <label htmlFor="de_nuke">
          <input type="radio" id="de_nuke" value="de_nuke" checked={props.selected === 'de_nuke'} onChange={props.onChange}/>
          <img src={de_nuke} alt="de_nuke" />
        </label>
        <label htmlFor="de_overpass">
          <input type="radio" id="de_overpass" value="de_overpass" checked={props.selected === 'de_overpass'} onChange={props.onChange}/>
          <img src={de_overpass} alt="de_overpass" />
        </label>
        <label htmlFor="de_train">
          <input type="radio" id="de_train" value="de_train" checked={props.selected === 'de_train'} onChange={props.onChange}/>
          <img src={de_train} alt="de_train" />
        </label>
      </form>);
  }

export default MapPicker;
