'use strict';

import React , {Component} from 'react';
import { Navigator } from 'react-native';

const Game = require('./game');
const PuzzlesLaunch = require('./puzzles_launch');


class AppNavigator extends React.Component{
  constructor(props) {
  super(props);
  }

  render() {
    var initialRouteID = 'game board';
    return (
      <Navigator
        initialRoute={{id: 'puzzle launcher'}}
        renderScene={this.navigatorRenderScene}/>
    );
  }

  navigatorRenderScene(route, navigator) {
    switch (route.id) {
      case 'game board':
        return (<Game navigator={navigator} route={route} title="Game Board"/>);
      case 'puzzle launcher':
        return (<PuzzlesLaunch navigator={navigator} route={route} title="Puzzle Launcher"/>);
      // Add more ids here
    }
  }
}


module.exports = AppNavigator;