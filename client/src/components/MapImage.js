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

const MapImage = (map) => {
      let mapImg;
      switch (map) {
        case 'cs_agency':
          mapImg = cs_agency;
          break;
        case 'cs_office':
          mapImg = cs_office;
          break;
        case 'de_cache':
          mapImg = de_cache;
          break;
        case 'de_canals':
          mapImg = de_canals;
          break;
        case 'de_cbble':
          mapImg = de_cbble;
          break;
        case 'de_dust2':
          mapImg = de_dust2;
          break;
        case 'de_inferno':
          mapImg = de_inferno;
          break;
        case 'de_mirage':
          mapImg = de_mirage;
          break;
        case 'de_nuke':
          mapImg = de_nuke;
          break;
        case 'de_overpass':
          mapImg = de_overpass;
          break;
        case 'de_train':
          mapImg = de_train;
          break;
        default:
          mapImg = null;
      }
      return mapImg;
};

export default MapImage;