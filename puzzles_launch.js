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
function shadeColor(color, percent) {
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

class PuzzleLaunch extends Component{
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
            bgColor: this.props.bgColor,
            textColor: this.props.textColor,
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
    headerFooter(color){
         var strToReturn = shadeColor(color, -10);
         return {backgroundColor: strToReturn};
    }
    containerBg(color){
         var strToReturn = shadeColor(color, 60);
         return {backgroundColor: strToReturn};
    }
    darkBorder(color) {
        var darkerColor = shadeColor(color, -60);
            return {borderColor: darkerColor};
    }
    onSelect(passed) {
        if(passed>parseInt(this.state.onPuzzle, 10) + 1)return;
        passed = passed - 1;
        var fragObject = owl.deepCopy(fragData);
        var puzzString = fileData[this.props.dataElement].puzzles[passed];
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
                myBg: this.props.bgColor,
                myTitle: this.props.title,
                myTextColor: this.props.textColor,
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

                <View style={ [container_styles.container, this.darkBorder(this.props.bgColor)] }>
                    <View style={ [container_styles.header, this.headerFooter(this.props.bgColor)] }>
                        <Button style={{left: 10}} onPress={ () => this.toggle() }>
                            <Image source={ require('./images/menu.png') } style={ { width: 32, height: 32 } } />
                        </Button>
                        <Text style={{fontSize: 18, color: this.props.textColor}} >{this.props.title}
                        </Text>
                        <Button>
                            <Image source={ require('./images/no_image.png') } style={ { width: 32, height: 32 } } />
                        </Button>
                    </View>
                    <View style={ [container_styles.tiles_container, this.containerBg(this.props.bgColor), this.darkBorder(this.props.bgColor)] }>
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
                    <View style={[container_styles.footer, this.headerFooter(this.props.bgColor)]}>
                        <Text style={{fontSize: 11, color: this.props.textColor}}>Some fine print...</Text>
                    </View>
                 </View>
            </SideMenu>
        );
    }
}


var container_styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    tiles_container: {
        flex: 45,
        paddingLeft: 6,
        paddingRight: 6,
    },
    header: {
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: window.width,
    },
    footer: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: window.width,
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
