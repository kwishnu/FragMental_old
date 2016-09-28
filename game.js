import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

//var FragTiles = require('./frag_tiles.js');
var {width, height} = require('Dimensions').get('window');
var NUM_WIDE = 5;
var NUM_HIGH = 4;
var CELL_WIDTH = Math.floor(width * .2); // 20% of the screen width
var CELL_HEIGHT = CELL_WIDTH * 0.6;
var CELL_PADDING = Math.floor(CELL_WIDTH * .05); // 5% of the cell width
var BORDER_RADIUS = CELL_PADDING * 0.6;
var TILE_SIZE = CELL_WIDTH - CELL_PADDING * 2;
var LETTER_SIZE = Math.floor(TILE_SIZE * .4);



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
        <View style={styles.container}>
            {this.drawTiles()}
        </View>
    );
  }

  drawTiles() {
    var result = [];
    for (var row = 0; row < NUM_WIDE; row++) {
        for (var col=0; col<NUM_HIGH; col++){
              var key = row * NUM_WIDE + col;
              var style = {
                left: col * CELL_WIDTH + CELL_PADDING,
                top: row * CELL_WIDTH + CELL_PADDING,
                }
                result.push(this.drawTile(key, style));

        }
    }
    return result;

  }


  drawTile(key, position) {
    return <View style={[styles.tile, position]} key={key}>
        <TouchableHighlight   underlayColor='transparent' onPress={() => this.show(key)}><Text style={styles.letter}>{key}</Text></TouchableHighlight>
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
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
  },

  letter: {
    color: '#00f',
    fontSize: LETTER_SIZE,
  },
});

module.exports = Game;