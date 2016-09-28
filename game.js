import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

//var FragTiles = require('./frag_tiles.js');
var {width, height} = require('Dimensions').get('window');
var NUM_HIGH = 4;
var NUM_WIDE = 5;
var CELL_WIDTH = Math.floor(width * .2); // 20% of the screen width
var CELL_HEIGHT = CELL_WIDTH * 0.6; // 20% of the screen width
var CELL_PADDING = Math.floor(CELL_WIDTH * .05); // 5% of the cell size
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

    for (var i=0; i<4; i++){
          var id = i;
          var style = {
            left: i * CELL_WIDTH + CELL_PADDING,
            top: i * CELL_WIDTH + CELL_PADDING,
            }
            result.push(this.drawTile(id, style));

    }
    return result;

  }


  drawTile(id, style) {
    return <View key={id}>
        <TouchableHighlight  style={styles.tile} underlayColor='transparent' onPress={() => this.show()}><Text style={styles.letter}>{this.state.theWord}</Text></TouchableHighlight>
                      </View>
  }

  show(){
  window.alert(this.state.text);
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