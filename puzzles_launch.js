import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, ScrollView, BackAndroid, Navigator  } from 'react-native';

var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');
var styles = require('./styles');
var {width, height} = require('Dimensions').get('window');
var NUM_WIDE = 4;
var NUM_HIGH = 5;
var CELL_WIDTH = Math.floor(width * .24); // 20% of the screen width
var CELL_HEIGHT = CELL_WIDTH * .55;
var CELL_PADDING = Math.floor(CELL_WIDTH * .05); // 5% of the cell width
//var CONTAINER_PADDING = (width - (CELL_WIDTH * NUM_WIDE))/2

class PuzzleLaunch extends React.Component{
    constructor(props) {
    super(props);
    this.state = {
        id: 'puzzle launcher',
        text: 'Hello',
        theWord: 'test',
        isOpen: false,
        edgeHitWidth : width/2,
    };

    this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    handleHardwareBackButton(){
        if(this.state.isOpen){
               this.toggle();
               return true;
        }
    }
    toggle() {
      this.setState({
        isOpen: !this.state.isOpen,
      });
        if(this.state.isOpen){
                BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        }else{
                BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
        }
    }
    updateMenuState(isOpen) {
      this.setState({ isOpen, });
      if(isOpen){
              BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
      }else{
              BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
      }

    }
    onMenuItemSelected = (item) => {
      this.setState({
        isOpen: false,
        selectedItem: item,
      });
      window.alert(item);
    }
    border= function(color){
        return{
            borderColor: color,
            borderWidth: 2,
        }
    }
    onSelect(passed){
        this.props.navigator.push({
            id: 'game board'
        });
    }

    render() {
    const menu = <Menu onItemSelected={this.onMenuItemSelected} />;

    return (
        <SideMenu
                menu={menu}
                isOpen={this.state.isOpen}
                onChange={(isOpen) => this.updateMenuState(isOpen)}>

            <View style={[container_styles.container, this.border('black')]}>
                <View style={container_styles.header}>
                    <Button style={styles.menu_arrow} onPress={() => this.toggle()}>
                        <Image source={require('./images/menu.png')} style={{width: 32, height: 32}} />
                    </Button>
                </View>
                <View style={[container_styles.tiles_container, this.border('black')]}>

                <ScrollView style={container_styles.scrollview}>
                    <Button style={styles.menu_arrow} onPress={() => this.onSelect('hi')}>
                        <Image source={require('./images/arrow_back.png')} style={{width: 32, height: 32}} />
                    </Button>

                </ScrollView>
                </View>

                <View style={container_styles.footer}>
                 <Text style={styles.copyright}>Some fine print...</Text>
                </View>

             </View>
        </SideMenu>

    );
    }

    drawTiles() {
        var result = [];
        for (var row = 0; row < NUM_HIGH; row++) {
            for (var col=0; col<NUM_WIDE; col++){
                  var key = row * NUM_WIDE + col;
                  var style = {
                    left: (col * CELL_WIDTH) + CELL_PADDING,
                    top: (row * CELL_HEIGHT) + CELL_PADDING,
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

var container_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09146d',
  },
  scrollview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flex: 4,
    alignItems: 'center',
    flexDirection: 'row',
    width: window.width,
    backgroundColor: '#3e05a6',
  },
  tiles_container: {
    flex: 45,
    backgroundColor: '#09146d',
    padding: 6,
  },
  footer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09146d',
  },

});

module.exports = PuzzleLaunch;