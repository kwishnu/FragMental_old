import React, { Component, PropTypes } from 'react';
import {  StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, ListView, BackAndroid, Animated, AsyncStorage  } from 'react-native';
import moment from 'moment';
import SectionHeader  from './components/SectionHeader';
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
function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
var deepCopy = require('./deepCopy.js');
var fragData = require('./objPassed.js');
var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');
var styles = require('./styles');
var {width, height} = require('Dimensions').get('window');
var CELL_WIDTH = Math.floor(width); // one tile's fraction of the screen width
var CELL_PADDING = Math.floor(CELL_WIDTH * .05) + 5; // 5% of the cell width...+
var TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2) - 7;
var BORDER_RADIUS = CELL_PADDING * .2 + 3;
var _scrollView = ListView;
var KEY_ScrollPosition = 'scrollPositionKey';
var KEY_onPuzzle = 'onPuzzle';

var now = moment().format("MMMM DD, YYYY");
var nowISO = moment();
var launchDay = moment("2016 10", "YYYY-MM");//November 1, 2016
var dayDiff = launchDay.diff(nowISO, "days");//# of days since 11/1/2016
var daysToSkip = parseInt(dayDiff, 10) - 31;

var fileData = require('./data.js');
var dataLength = fileData.length;

class PuzzleContents extends React.Component{
    constructor(props) {
        super(props);
        const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
        const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];
        const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
          getSectionData,
          getRowData,
        });
        const { dataBlob, sectionIds, rowIds } = this.formatData(fileData);

        this.state = {
            id: 'puzzles contents',
            isOpen: false,
            dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),//(Array.from(new Array(dataLength), (x,i) => i+1)),//NUM_WIDE * NUM_ROWS
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
    formatData(data) {
        const headings = 'Daily Puzzles*My Puzzles*Recommended Puzzle Packs*Completed Puzzle Packs'.split('*');
        const keys = 'daily*mypack*forsale*solved'.split('*');
        const dataBlob = {};
        const sectionIds = [];
        const rowIds = [];
        for (let sectionId = 0; sectionId < headings.length; sectionId++) {
            const currentHead = headings[sectionId];
            const currentKey = keys[sectionId];
            const packs = data.filter((theData) => theData.type == currentKey && theData.show == 'true');
            if (packs.length > 0) {
                sectionIds.push(sectionId);
                dataBlob[sectionId] = { sectionTitle: currentHead };
                rowIds.push([]);
                for (let i = 0; i < packs.length; i++) {
                    const rowId = `${sectionId}:${i}`;
                    rowIds[rowIds.length - 1].push(rowId);
                    dataBlob[rowId] = packs[i];
                }
            }
        }
        return { dataBlob, sectionIds, rowIds };
    }
    //'ws://52.8.88.93:80/websocket'; <= baked-beans-games...publication details-list, collection details
    //'ws://52.9.147.169:80/websocket'; <= bbg2...publication PuzzlesList, collection puzzles (field "name")
    //'ws://52.52.199.138:80/websocket'; <= bbg3...publication AllData, collections data, data1, data2, details, puzzles, text, users
    //'ws://52.52.205.96:80/websocket'; <= Publications...publication AllData, collections dataA...dataZ
    //'ws://10.0.0.207:3000/websocket'; <= localhost
//    componentWillMount() {
//        let METEOR_URL = 'ws://52.52.205.96:80/websocket';////'ws://52.9.147.169:80/websocket';//'ws://52.8.88.93:80/websocket';'ws://10.0.0.207:3000/websocket';//'ws://52.52.205.96:80/websocket';
//        Meteor.connect(METEOR_URL);
//
//          //const handle = Meteor.subscribe('AllData');//('AllData');('PuzzlesList');
//
//Meteor.subscribe('AllData', {
//  onReady: function () {
//    //this.sendToStorage();
//    //console.log("onReady And the Items actually Arrive", arguments);
//              const messages = Meteor.collection('dataJ').find();
//              //const restoredArray = EJSON.stringify(messages);
//             // window.alert(messages.toString());
//              //window.alert((typeof messages).toString());
//                     // window.alert(sent);
//
//            for (var key in messages) {
//                if (!messages.hasOwnProperty(key)) continue;
//                var obj = messages[key];
//                for (var prop in obj) {
//                    if(!obj.hasOwnProperty(prop)) continue;
//                    if(prop=='text')
//                    //window.alert(prop + " = " + obj[prop]);
//                    window.alert(obj[prop]);
//                }
//            }
//
//    },
//  onError: function () {
//    window.alert('oops');
//    }
//});
//}

    componentDidMount() {
    //window.alert(-(parseInt(dayDiff,10)));
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
    shadeColor(color, percent) {
        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;
        G = (G<255)?G:255;
        B = (B<255)?B:255;

        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

        return '#'+RR+GG+BB;
    }
    border(color) {
        return {
            borderColor: color,
            borderWidth: 2,
        };
    }
    lightBorder(color, num) {
        var lighterColor = this.shadeColor(color, 80);
        var bordWidth = (num<3)? 1:6;
            return {
                borderColor: lighterColor,
                borderWidth: bordWidth,
            };
    }
    bg(colorSent){
         var strToReturn=colorSent;
//         if(num==parseInt(this.state.onPuzzle, 10) + 1){
//             strToReturn='#0F0';
//             }else if(num<parseInt(this.state.onPuzzle, 10) + 1){
//             strToReturn='#079707';
//             }else{
//             strToReturn='#999ba0';
//             }

         return {
         backgroundColor: strToReturn
         };
    }
    onSelect (sent) {
    var value = 'test2';
         Meteor.call('DataJ.deleteOne', { value }, (err, res) => {
            // Do whatever you want with the response
            //window.alert(res);
        });

//         Meteor.call('DataJ.addOne', { value }, (err, res) => {
//            // Do whatever you want with the response
//            console.log('Items.addOne', err, res);
//        });
    }
    onSelect(index, howMany, puzzArray, title, bg) {
        var theDestination = 'puzzle launcher';
        var theTitle = title;
        var textColor = '';

        switch(index){
            case '0':
                theDestination = 'game board';
                var thePieces = this.makePuzzArray(puzzArray);
                var theKeyFrag = '';
                var theData = {};

                this.props.navigator.replace({
                    id: 'game board',
                    passProps: {
                        theData: thePieces[0],
                        keyFrag: thePieces[1],
                        title: now,
                        theCluesArray: thePieces[2],
                        fromWhere: 'puzzles contents',
                        arraySize: '1',
                        dataElement: '0',
                        },
                        });
                        return;
                break;
            case '1':
            case '2':  //fallthrough
                theDestination = 'daily launcher';
                theTitle = 'Daily Puzzles'
                break;
            default:
                textColor = invertColor(bg, true);
        }
        this.props.navigator.replace({
            id: theDestination,
            passProps: {
                title: theTitle,
                arraySize: howMany,
                dataElement: index,
                puzzleArray: puzzArray,
                bgColor: bg,
                textColor: textColor,
                },
       });
    }
    makePuzzArray(puzzString){
            var puzzArray = puzzString[0].split('~');
            var fragsArray = [];
            var fragsPlusClueArr =  puzzArray[1].split('**');
            var fragObject = owl.deepCopy(fragData);

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
            var pieces = [fragObject, puzzArray[0], fragsPlusClueArr];
            return pieces;


    }
    renderSectionHeader(sectionID) {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionText}>{sectionID}</Text>
            </View>
          )
    }
    renderRow(pack) {
        return (
             <View>
                 <TouchableHighlight style={container_styles.launcher} >
                     <Text style={ styles.puzzle_text_large }>{pack.name}</Text>
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
                    <View style={ container_styles.puzzles_container }>
                         <ListView  ref={(scrollView) => { _scrollView = scrollView; }}
                                    showsVerticalScrollIndicator ={false}
                                    initialListSize ={100}
                                    contentContainerStyle={ container_styles.listview }
                                    dataSource={this.state.dataSource}
                                    renderRow={(rowData) =>
                                     <View>
                                         <TouchableHighlight onPress={() => this.onSelect(rowData.index, rowData.num_puzzles, rowData.puzzles, rowData.title, rowData.bg_color)}
                                                             underlayColor={() => this.bg(rowData.bg_color) }
                                                             style={[container_styles.launcher, this.bg(rowData.bg_color), this.lightBorder(rowData.bg_color, rowData.index)]} >
                                             <Text style={ styles.contents_text }>{rowData.title}</Text>
                                         </TouchableHighlight>
                                     </View>
                                     }
                                     renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
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

//<PuzzlesContainer navigator={this.props.navigator} id={'puzzle contents'}/>



var container_styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: window.width,
        backgroundColor: '#09146d',
    },
    puzzles_container: {
        flex: 45,
        backgroundColor: '#486bdd',
        justifyContent: 'center',
        alignItems: 'center',
//        paddingLeft: 6,
//        paddingRight: 6,
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
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
    },
});
module.exports = PuzzleContents;
