import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity } from 'react-native';

var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');
var styles = require('./styles');
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

    state = {
      isOpen: false,
      selectedItem: 'About',
    };

    toggle() {
      this.setState({
        isOpen: !this.state.isOpen,
      });
    }

    updateMenuState(isOpen) {
      this.setState({ isOpen, });
    }

    onMenuItemSelected = (item) => {
      this.setState({
        isOpen: false,
        selectedItem: item,
      });
      window.alert(item);
    }

    render() {
    const menu = <Menu onItemSelected={this.onMenuItemSelected} />;

    return (
        <SideMenu
                menu={menu}
                isOpen={this.state.isOpen}
        onChange={(isOpen) => this.updateMenuState(isOpen)}>

            <View style={styles.container}>
                <View style={styles.tiles_container}>
                    {this.drawTiles()}
                </View>
            </View>
                <Button style={styles.button} onPress={() => this.toggle()}>
                        <Text style={styles.letter}>{"Menu"}</Text>
                </Button>
        </SideMenu>

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
}

class Button extends Component {
  handlePress(e) {
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}
        style={this.props.style}>
        <Text>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

module.exports = Game;