'use strict';
import React, {Component} from 'react';
import { Navigator } from 'react-native';

const SplashScreen = require('./splash_screen');
const StartScene = require('./start_scene');
const PuzzlesContents = require('./puzzles_contents');
const DailyLaunch = require('./p_daily_launch');
const PuzzlesLaunch = require('./puzzles_launch');
const Game = require('./game');
const StoreListView = require('./store_listview');
const ComboStore = require('./store_listview3');
const Settings = require('./settings');

class AppNavigator extends React.Component {
    constructor(props) {
        super(props);
    }
    navigatorRenderScene(routeID) {
        switch (routeID) {
            case 'splash screen':
                return SplashScreen;
            case 'start scene':
                return StartScene;
            case 'puzzles contents':
                return PuzzlesContents;
            case 'daily launcher':
                return DailyLaunch;
            case 'puzzle launcher':
                return PuzzlesLaunch;
            case 'game board':
                return Game;
            case 'store':
                return StoreListView;
            case 'combo store':
                return ComboStore;
            case 'settings':
                return Settings;

            // Add more ids here
        }
    }

    render() {
        return (
            <Navigator
              initialRoute={ { id: 'splash screen' } }
              renderScene={(route, navigator) => {
                return React.createElement(this.navigatorRenderScene(route.id), { ...this.props, ...route.passProps, navigator, route } );
              }} />
        );
    }
}

module.exports = AppNavigator;
