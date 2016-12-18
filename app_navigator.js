'use strict';

import React , {Component} from 'react';
import { Navigator } from 'react-native';

const Game = require('./game');
const PuzzlesLaunch = require('./puzzles_launch');
const PuzzlesContents = require('./puzzles_contents');
const Puzzles = require('./Puzzles');

class AppNavigator extends React.Component {
    constructor(props) {
        super(props);
    }
    navigatorRenderScene(routeID) {
        switch (routeID) {
            case 'game board':
                return Game;
            case 'puzzle launcher':
                return PuzzlesLaunch;
            case 'puzzles contents':
                return PuzzlesContents;
            // Add more ids here
        }
    }

    render() {
        return (
            <Navigator
              initialRoute={ { id: 'puzzles contents' } }
              renderScene={(route, navigator) => {
                return React.createElement(this.navigatorRenderScene(route.id), { ...this.props, ...route.passProps, navigator, route } );
              }} />
        );
    }
}

module.exports = AppNavigator;
