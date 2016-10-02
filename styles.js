import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

const window = Dimensions.get('window');

var { width, height } = require('Dimensions').get('window');
var NUM_WIDE = 4;
var NUM_HIGH = 5;
var CELL_WIDTH = Math.floor(width * .24); // 20% of the screen width
var CELL_HEIGHT = CELL_WIDTH * .55;
var CELL_PADDING = Math.floor(CELL_WIDTH * .05); // 5% of the cell width
var BORDER_RADIUS = CELL_PADDING * .2;
var TILE_WIDTH = CELL_WIDTH - CELL_PADDING * 2;
var TILE_HEIGHT = CELL_HEIGHT - CELL_PADDING * 2;
var LETTER_SIZE = Math.floor(TILE_HEIGHT * .6);


module.exports = StyleSheet.create({
    tile: {
        position: 'absolute',
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        borderRadius: BORDER_RADIUS,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dedffa',
    },
    letter: {
        color: '#000',
        fontSize: LETTER_SIZE,
        backgroundColor: 'transparent',
    },
    menu: {
        flex: 1,
        width: window.width,
        height: window.height,
        backgroundColor: 'blue',
        padding: 20,
    },
    menu_font: {
        color: '#fff',
        fontSize: 40,
    },
    menu_arrow: {
        left: 10,
    },
    menu_button: {
    },
    caption: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    avatarContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        flex: 1,
    },
    name: {
        color: '#fff',
        fontSize: 20,
    },
    item: {
        fontSize: 20,
        color: '#fff',
    },
    copyright: {
        fontSize: 10,
        color: '#fff',
        marginBottom:10,
    },
});
