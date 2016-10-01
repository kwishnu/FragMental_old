//"landing page" for both index.android.js and index.ios.js to host Navigation for app

'use strict';

import React , {Component} from 'react';
import
{
  View,
  Navigator
}
from 'react-native';

var Navigation = require('./app_navigator');

class Nav extends Component {
    render(){
        return(
            <Navigation></Navigation>
        );
    }
}

module.exports = Nav;