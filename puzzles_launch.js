import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, ListView, BackAndroid, Animated, AsyncStorage  } from 'react-native';
import Button from './components/Button';

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var deepCopy = require('./deepCopy.js');
var fileData = require('./data.js');
var fragData = require('./objPassed.js');
var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');
var styles = require('./styles');
var {width, height} = require('Dimensions').get('window');
var NUM_WIDE = 5;
var CELL_WIDTH = Math.floor(width/NUM_WIDE); // one tile's fraction of the screen width
var CELL_PADDING = Math.floor(CELL_WIDTH * .05) + 5; // 5% of the cell width...+
var TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2) - 7;
var BORDER_RADIUS = CELL_PADDING * .2 + 3;
var _scrollView = ListView;
var KEY_ScrollPosition = 'scrollPositionKey';
var KEY_onPuzzle = 'onPuzzle';

class PuzzleLaunch extends React.Component{
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            id: 'puzzle launcher',
            puzzleArray: this.props.puzzleArray,
            arraySize: this.props.arraySize,
            dataElement: this.props.dataElement,
            title: this.props.title,
            isOpen: false,
            dataSource: ds.cloneWithRows(Array.from(new Array(parseInt(this.props.arraySize, 10)), (x,i) => i+1)),
            scrollPosition: 0,
            onPuzzle: 0,
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
//    window.alert(this.props.arraySize);
        BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
         AsyncStorage.getItem(KEY_onPuzzle).then((value) => {
                 this.setState({onPuzzle: parseInt(value, 10)});
        });
    }
    componentWillUnmount () {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    handleHardwareBackButton() {
        if (this.state.isOpen) {
            this.toggle();
            return true;
        }else{
            try {
            this.props.navigator.replace({
                id: 'puzzles contents',
            });
                return true;
            } catch(err)  {
                return false;
            }
        }
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
    updateMenuState(isOpen) {
        this.setState({ isOpen, });

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
        var fragObject = owl.deepCopy(fragData);
        var puzzString = fileData[this.props.dataElement].puzzles[passed];
//window.alert(typeof puzzString);
//return;
        //var puzzString = fileData[passed].puzzle;
        var puzzArray = puzzString.split('~');
        var fragsArray = [];
        var fragsPlusClueArr =  puzzArray[1].split('**');

        for(var i=0; i<fragsPlusClueArr.length; i++){
            var splits = fragsPlusClueArr[i].split(':');
            var frags = splits[0].split('|');
            for(var j=0; j<frags.length; j++){
                fragsArray.push(frags[j]);
            }
        }
        fragsArrayShuffled = shuffleArray(fragsArray);
        var countTo20 = 0;
        for(var k=0; k<fragsArrayShuffled.length; k++){
            if(fragsArrayShuffled[k]!='^'){
            fragObject[countTo20].frag= fragsArrayShuffled[k];
            countTo20++;
            }
        }

        this.props.navigator.replace({
            id: 'game board',
            passProps: {
                title: passed + 1,
                keyFrag: puzzArray[0],
                theData: fragObject,
                theCluesArray: fragsPlusClueArr,
                fromWhere: 'puzzle launcher',
                arraySize: this.props.arraySize,
                dataElement: this.props.dataElement,
                },
       });
    }

    render() {
        const menu = <Menu onItemSelected={ this.onMenuItemSelected } />;
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
                        <Text style={styles.header_text} >{this.props.title}
                        </Text>
                        <Button>
                            <Image source={ require('./images/no_image.png') } style={ { width: 32, height: 32 } } />
                        </Button>
                    </View>
                    <View style={ [container_styles.tiles_container, this.border('#070f4e')] }>
                         <ListView  ref={(scrollView) => { _scrollView = scrollView; }}
                                    showsVerticalScrollIndicator ={false}
                                    initialListSize ={100}
                                    contentContainerStyle={ container_styles.listview }
                                    dataSource={this.state.dataSource}
                                    renderRow={(rowData) =>
                                     <View>
                                         <TouchableHighlight onPress={() => this.onSelect(rowData.toString())}
                                                             underlayColor={() => this.getUnderlay(rowData) }
                                                             style={[container_styles.launcher, this.getBorder(rowData), this.bg(rowData)]} >
                                             <Text style={ styles.puzzle_text_large }>{rowData}</Text>
                                         </TouchableHighlight>
                                     </View>}
                         />
                    </View>
                    <View style={ container_styles.footer }>
                        <Text style={ styles.copyright }>Some fine print...</Text>
                    </View>
                 </View>
            </SideMenu>
        );
    }
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
        height: TILE_WIDTH,
        borderRadius: BORDER_RADIUS,
        borderWidth: 1,
        margin: CELL_PADDING,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

module.exports = PuzzleLaunch;
