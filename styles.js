import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity } from 'react-native';

const window = Dimensions.get('window');

var {width, height} = require('Dimensions').get('window');
var NUM_WIDE = 4;
var NUM_HIGH = 5;
var CELL_WIDTH = Math.floor(width * .24); // 20% of the screen width
var CELL_HEIGHT = CELL_WIDTH * 0.55;
var CELL_PADDING = Math.floor(CELL_WIDTH * .05); // 5% of the cell width
var BORDER_RADIUS = CELL_PADDING * 0.2;
var TILE_WIDTH = CELL_WIDTH - CELL_PADDING * 2;
var TILE_HEIGHT = CELL_HEIGHT - CELL_PADDING * 2;
var LETTER_SIZE = Math.floor(TILE_HEIGHT * .6);


module.exports = StyleSheet.create({
  game_header: {
    justifyContent: 'center',
    width: window.width,
    height: 46,
    backgroundColor: 'blue',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09146d',
    padding:5,
  },
  clues_container: {
    flex: 6,
    backgroundColor: '#09146d',
  },
  tiles_container: {
    flex: 1,
    width: CELL_WIDTH * NUM_WIDE,
    height: CELL_HEIGHT * NUM_HIGH,
    backgroundColor: '#09146d',
  },
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
  menu_button: {
    left: 10,
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