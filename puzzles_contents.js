import React, { Component, PropTypes } from 'react';
import {  StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, ListView, BackAndroid, Animated, AsyncStorage  } from 'react-native';
//import DDPClient from 'ddp-client';
import Meteor, { MeteorListView, createContainer } from 'react-native-meteor';
import PuzzlesContainer from './PuzzlesContainer';
import Puzzles from './Puzzles';


//var deepCopy = require('./deepCopy.js');
//var fileData = require('./data.js');
//var fragData = require('./objPassed.js');
var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');
var styles = require('./styles');
var {width, height} = require('Dimensions').get('window');
var NUM_WIDE = 1;
var NUM_ROWS = 10;
var CELL_WIDTH = Math.floor(width/NUM_WIDE); // one tile's fraction of the screen width
var CELL_PADDING = Math.floor(CELL_WIDTH * .05) + 5; // 5% of the cell width...+
var TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2) - 7;
var BORDER_RADIUS = CELL_PADDING * .2 + 3;
var _scrollView = ListView;
var KEY_ScrollPosition = 'scrollPositionKey';
var KEY_onPuzzle = 'onPuzzle';

let METEOR_URL = 'ws://52.52.199.138:80/websocket';//'ws://52.9.147.169:80/websocket';//'ws://10.0.0.207:3000/websocket';//'ws://localhost:3000/websocket';//'ws://52.8.88.93:80/websocket';
Meteor.connect(METEOR_URL);

class PuzzleContents extends React.Component{
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            id: 'puzzles contents',
            isOpen: false,
            dataSource: ds.cloneWithRows(Array.from(new Array(NUM_WIDE * NUM_ROWS), (x,i) => i+1)),
            scrollPosition: 0,
            onPuzzle: 0,
            connected: false,
            posts: {}
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    handleHardwareBackButton() {
        if (this.state.isOpen) {
            this.toggle();
            return true;
        }
    }

    componentDidMount() {
         AsyncStorage.getItem(KEY_onPuzzle).then((value) => {
                 this.setState({onPuzzle: parseInt(value, 10)});
        });
         AsyncStorage.getItem(KEY_ScrollPosition).then((value2) => {
                 this.setState({scrollPosition: parseInt(value2, 10)});
        });
    }
    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
        if (this.state.isOpen) {
            BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        } else {
            BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
        }
    }
    updateMenuState(isOpen) {
        this.setState({ isOpen });
        if (isOpen) {
            BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        } else {
            BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
        }
    }
    onMenuItemSelected(item) {
        this.setState({
            isOpen: false,
            selectedItem: item,
        });
        window.alert(item);
}
    border(color) {
        return {
            borderColor: color,
            borderWidth: 2,
        };
    }
    bg(num){
         var strToReturn='';
         if(num==parseInt(this.state.onPuzzle, 10) + 1){
             strToReturn='#0F0';
             }else if(num<parseInt(this.state.onPuzzle, 10) + 1){
             strToReturn='#079707';
             }else{
             strToReturn='#999ba0';
             }

         return {
         backgroundColor: strToReturn
         };
    }
    getUnderlay(num){
         var strToReturn='';
         if(num==parseInt(this.state.onPuzzle, 10) + 1){
             strToReturn='#01ff01';
             }else if(num<parseInt(this.state.onPuzzle, 10) + 1){
             strToReturn='#079707';
             }else{
             strToReturn='#999ba0';
             }

         return {strToReturn};
    }
    getBorder(num){
         var strToReturn='';
         if(num==parseInt(this.state.onPuzzle, 10) + 1){
             strToReturn='#0F0';
             }else if(num<parseInt(this.state.onPuzzle, 10) + 1){
             strToReturn='#00a700';
             }else{
             strToReturn='#7e867e';
             }

         return {borderColor: strToReturn};
    }
    onSelect(passed) {
    if(passed>parseInt(this.state.onPuzzle, 10) + 1)return;
        passed = passed - 1;

        this.props.navigator.replace({
            id: 'puzzle launcher',
            passProps: {
                title: 'Some puzzle pack!!',
                },
       });
    }
    renderRow(detail) {
        return (
             <View>
             <TouchableHighlight style={container_styles.launcher} >
             <Text style={ styles.puzzle_text_large }>{detail.name}</Text>
             </TouchableHighlight>
             </View>
        );
    }
    render() {
        const menu = <Menu onItemSelected={ this.onMenuItemSelected } />;
        const { puzzlesReady } = this.props;
        return (
            <SideMenu
                menu={ menu }
                isOpen={ this.state.isOpen }
                onChange={ (isOpen) => this.updateMenuState(isOpen) }>

                <View style={ [container_styles.container, this.border('#070f4e')] }>
                    <View style={ container_styles.header }>
                        <Button style={{left: 10}} onPress={ () => this.toggle() }>
                            <Image source={ require('./images/menu.png') } style={ { width: 32, height: 32 } } />
                        </Button>
                        <Text style={styles.header_text} >Contents
                        </Text>
                        <Button>
                            <Image source={ require('./images/no_image.png') } style={ { width: 32, height: 32 } } />
                        </Button>
                    </View>
                    <View style={ [container_styles.tiles_container, this.border('#070f4e')] }>
                        {!puzzlesReady && <Text>Not Ready...</Text>}
                         <PuzzlesContainer />
                    </View>

                    <View style={ container_styles.footer }>
                        <Text style={ styles.copyright }>Some fine print...</Text>
                    </View>
                 </View>
            </SideMenu>
        );
    }



}

export default createContainer( () => {
  const handle = Meteor.subscribe('AllData');//('PuzzlesList');
  return {
    puzzlesReady: handle.ready()
  };
}, PuzzleContents);

PuzzleContents.propTypes = {
  puzzlesReady: PropTypes.bool,
};

class Button extends Component {
    handlePress(e) {
        if (this.props.onPress) {
            this.props.onPress(e);
        }
    }
    render() {
        return (
            <TouchableOpacity
                onPress={ this.handlePress.bind(this) }
                style={ this.props.style } >
                <Text>{ this.props.children }</Text>
            </TouchableOpacity>
        );
    }
//        backgroundColor: '#3e05a6',
//        backgroundColor: '#09146d',
//        backgroundColor: '#dedffa',
//        backgroundColor: '#3043e2',

}

var container_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09146d',
    },
    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    header: {
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: window.width,
        backgroundColor: '#09146d',
    },
    tiles_container: {
        flex: 45,
        backgroundColor: '#486bdd',
        paddingLeft: 6,
        paddingRight: 6,
    },
    footer: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#09146d',
    },
    launcher: {
        width: TILE_WIDTH,
        height: TILE_WIDTH * .25,
        borderRadius: BORDER_RADIUS,
        borderWidth: 1,
        margin: CELL_PADDING,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
module.exports = PuzzleContents;