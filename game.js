import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

//var FragTiles = require('./frag_tiles.js');
var {width, height} = require('Dimensions').get('window');
var NUM_WIDE = 5;
var NUM_HIGH = 4;
var CELL_WIDTH = Math.floor(width * .17); // 20% of the screen width
var CELL_HEIGHT = CELL_WIDTH * 0.6;
var CELL_PADDING = Math.floor(CELL_WIDTH * .05); // 5% of the cell width
var BORDER_RADIUS = CELL_PADDING * 0.6;
var TILE_WIDTH = CELL_WIDTH - CELL_PADDING * 2;
var TILE_HEIGHT = CELL_HEIGHT - CELL_PADDING * 2;
var LETTER_SIZE = Math.floor(TILE_HEIGHT * .6);

class Game extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        text: 'Hello',
        theWord: 'test'
    };
  }
  render() {
    return (
        <View style={styles.container}><View style={styles.tiles_container}>
            {this.drawTiles()}
        </View></View>
    );
  }

  drawTiles() {
    var result = [];
    for (var row = 0; row < NUM_HIGH; row++) {
        for (var col=0; col<NUM_WIDE; col++){
              var key = row * NUM_WIDE + col;
              var style = {
                left: col * CELL_WIDTH + CELL_PADDING,
                top: row * CELL_HEIGHT + CELL_PADDING,
                }
                result.push(this.drawTile(key, style));
        }
    }
    return result;
  }

  drawTile(key, position) {
    return <View  key={key}>
             <TouchableHighlight  style={[styles.tile, position]} underlayColor='#0F0'
             onPress={() => this.show(key)}><Text style={styles.letter}>{key}</Text></TouchableHighlight>
           </View>
  }
  show(which){
  window.alert(which);
  }
};


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09146d',
  },
  tiles_container: {
    width: CELL_WIDTH * NUM_WIDE,
    height: CELL_HEIGHT * NUM_HIGH,
    backgroundColor: 'transparent',
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
    color: '#00f',
    fontSize: LETTER_SIZE,
    backgroundColor: 'transparent',
  },
});

module.exports = Game;