import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, ListView, BackAndroid, AsyncStorage } from 'react-native';
import moment from 'moment';
import SectionHeader  from './components/SectionHeader';
import Button from './components/Button';
var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');

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
var listening = false;
var deepCopy = require('./deepCopy.js');
var fragData = require('./objPassed.js');
var styles = require('./styles');
var {width, height} = require('Dimensions').get('window');
var CELL_WIDTH = Math.floor(width); // one tile's fraction of the screen width
var CELL_PADDING = Math.floor(CELL_WIDTH * .08); // 5% of the cell width...+
var TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2);
var BORDER_RADIUS = CELL_PADDING * .3;
var KEY_daily_solved_array = 'solved_array';
var KEY_midnight = 'midnight';
var nowISO = moment().valueOf();
var launchDay = moment('2016 10', 'YYYY-MM');//November 1, 2016
var dayDiff = launchDay.diff(nowISO, 'days');//# of days since 11/1/2016
var daysToSkip = parseInt(dayDiff, 10) - 31;
var tonightMidnight = moment().endOf('day').valueOf();
var sArray = [];


class PuzzleContents extends Component{
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
        const { dataBlob, sectionIds, rowIds } = this.formatData(this.props.puzzleData);

        this.state = {
            id: 'puzzles contents',
            isOpen: false,
            todayFull: null,
            dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
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
    componentDidMount() {
        var todayfull = moment().format('MMMM D, YYYY');
        this.setState({todayFull: todayfull});
        AsyncStorage.getItem(KEY_daily_solved_array).then((theArray) => {
            if (theArray !== null) {
              sArray = JSON.parse(theArray);
                  //window.alert(sArray.toString());
            } else {
                var solvedArray = new Array(30).fill('0');
                sArray = solvedArray;
                try {
                   AsyncStorage.setItem(KEY_daily_solved_array, JSON.stringify(solvedArray));
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
            return AsyncStorage.getItem(KEY_midnight)
        }).then( (value) => {
            if (value !== null) {
                var storedMidnight = parseInt(JSON.parse(value), 10);
                var milliSecsOver = nowISO - storedMidnight;

                if(milliSecsOver > 0){//at least the next day, update daily solved array
                    var numDays = Math.ceil(milliSecsOver/86400000);
                    numDays=(numDays>30)?30:numDays;
                    for (var shiftArray=0; shiftArray<numDays; shiftArray++){
                        sArray.unshift('0');
                        sArray.pop();
                    }
                    try {
                        AsyncStorage.setItem(KEY_daily_solved_array, JSON.stringify(sArray));
                        AsyncStorage.setItem(KEY_midnight, JSON.stringify(tonightMidnight));
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }
            } else {
                try {
                    AsyncStorage.setItem(KEY_midnight, JSON.stringify(tonightMidnight));
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
        });
//         AsyncStorage.getItem(KEY_onPuzzle).then((value) => {
//                 this.setState({onPuzzle: parseInt(value, 10)});
//        });
//         AsyncStorage.getItem(KEY_ScrollPosition).then((value2) => {
//                 this.setState({scrollPosition: parseInt(value2, 10)});
//        });
    }
    componentWillUnmount(){
        if(listening)BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);

    }
    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
        if (this.state.isOpen) {
            listening = true;
            BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        } else {
            listening = false;
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
    onMenuItemSelected = (item) => {

    //window.alert(item.link);
        switch (item.link){
            case 'puzzles contents':
                this.props.navigator.push({
                    id: 'puzzles contents',
                    passProps: {
                        puzzleData: this.props.puzzleData,
                    }
                });
                break;
            case 'game board':
                this.onSelect('16','Today\'s Puzzle', null);
                break;
            case 'daily launcher':
                //check for upgrade, route accordingly todo
                this.onSelect('17','Last Three Days', null);
                break;
            case 'store':
                this.props.navigator.push({
                    id: 'store',
                    passProps: {
                        dataIndex: item.index,
                        title: item.title + ' Puzzle Packs',
                        puzzleData: this.props.puzzleData,
                    }
                });
                break;
            case 'store3':
                this.props.navigator.push({
                    id: 'combo store',
                    passProps: {
                        dataIndex: item.index,
                        title: item.title + ' Value Packs',
                        puzzleData: this.props.puzzleData,
                    }
                });
                break;

            case 'app_intro':
                this.props.navigator.push({
                    id: 'start scene',
                    passProps: {
                        puzzleData: this.props.puzzleData,
                    }
                });
                break;
        }



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
    lightBorder(color, type) {
        var lighterColor = this.shadeColor(color, 60);
        //lighterColor = (num!=1 && num!=2)?lighterColor:'#f05356';
        var bordWidth = (type == 'daily')? 1:6;
            return {
                borderColor: lighterColor,
                borderWidth: bordWidth,
            };
    }
    bg(colorSent){
         var strToReturn=colorSent.replace(/\"/g, "");
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
//    onSelect (sent) {
//    var value = 'test2';
//         Meteor.call('DataJ.deleteOne', { value }, (err, res) => {
//            // Do whatever you want with the response
//            //window.alert(res);
//        });
//
//         Meteor.call('DataJ.addOne', { value }, (err, res) => {
//            // Do whatever you want with the response
//            console.log('Items.addOne', err, res);
//        });
//    }
    onSelect(index, title, bg) {
        var theDestination = 'puzzle launcher';
        var theTitle = title;
        var textColor = '';

        switch(title){
            case 'Today\'s Puzzle':
                theDestination = 'game board';
                this.props.navigator.replace({
                    id: 'game board',
                    passProps: {
                        puzzleData: this.props.puzzleData,
                        daily_solvedArray: sArray,
                        title: this.state.todayFull,
                        index: '0',
                        fromWhere: 'puzzles contents',
                        dataElement: index,
                    },
                });
                return;
                break;
            case 'Last Three Days':
            case 'Last Thirty Days':  //fallthrough
                theDestination = 'daily launcher';
                theTitle = 'Daily Puzzles'
                //theDate =
                break;
            default:
                textColor = invertColor(bg, true);
        }
        this.props.navigator.replace({
            id: theDestination,
            passProps: {
                puzzleData: this.props.puzzleData,
                daily_solvedArray: sArray,
                title: theTitle,
                dataElement: index,
                bgColor: bg,
                textColor: textColor,
            },
       });
    }

    render() {
        const menu = <Menu onItemSelected={this.onMenuItemSelected} data = {this.props.puzzleData} />;

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
                         <ListView  showsVerticalScrollIndicator ={false}
                                    initialListSize ={100}
                                    contentContainerStyle={ container_styles.listview }
                                    dataSource={this.state.dataSource}
                                    renderRow={(rowData) =>
                                     <View>
                                         <TouchableHighlight onPress={() => this.onSelect(rowData.index, rowData.title, rowData.bg_color)}
                                                             style={[container_styles.launcher, this.bg(rowData.bg_color), this.lightBorder(rowData.bg_color, rowData.type)]}
                                                             underlayColor={rowData.bg_color} >
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
//09146d


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
        backgroundColor: '#12046c',
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
        marginTop: 6,
        marginBottom: 1,

    },
});
module.exports = PuzzleContents;
