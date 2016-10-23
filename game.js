import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, BackAndroid, AsyncStorage  } from 'react-native';

var deepCopy = require('./deepCopy.js');
var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');
var styles = require('./styles');
var {width, height} = require('Dimensions').get('window');
var NUM_WIDE = 4;
var NUM_HIGH = 5;
var CELL_WIDTH = Math.floor(width * .24); // 20% of the screen width
var CELL_HEIGHT = CELL_WIDTH * .55;
var CELL_PADDING = Math.floor(CELL_WIDTH * .05); // 5% of the cell width
var databackup = null;

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'game board',
            isOpen: false,
            title: this.props.title,
            theData: this.props.theData,
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        databackup = owl.deepCopy(this.props.theData);
        BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
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
                id: 'puzzle launcher',
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
        }
    }
    closeGame() {
        this.props.navigator.replace({
            id: 'puzzle launcher',
        });
    }
    drawTiles() {
        var result = [];
        var data = this.state.theData;
        for (var index = 0; index < data.length; ++index) {
            var style = {
                left: (parseInt(data[index].col, 10) * CELL_WIDTH) + CELL_PADDING,
                top: (parseInt(data[index].row, 10) * CELL_HEIGHT) + CELL_PADDING,
            }
            var text = data[index].word;
        result.push(this.drawTile(index, style, text));
        }
        return result;
    }
    drawTile(key, position, frag) {
        return (
            <View  key={ key }>
                <TouchableHighlight
                    style={ [styles.tile, position] }
                    underlayColor='#0F0'
                    onPress={ () => this.show(key) } >

                    <Text style={ styles.puzzle_text_large }>{ frag }</Text>
                </TouchableHighlight>
            </View>
        );
    }
    clueRows(){
        var result = [];
        var rowStyle = styles.clue_row_light;
        for (var row = 0; row < 7; row++) {
            var key = row;
            rowStyle = (rowStyle == styles.clue_row_light)?styles.clue_row_dark:styles.clue_row_light;
            result.push(
            <View  key={ key } style= {rowStyle}>
                <View style= {styles.clue_section}>
                <Text style= {styles.puzzle_text_small}>
                    {"This is a clue for guessing a word"}
                </Text>
                </View>
                 <View style= {styles.word_section}>
                 <Text style= {styles.puzzle_text_small}>
                     {"And..a word"}
                 </Text>
                 </View>
            </View>
            );
        }
        return result;
    }
    show(which) {
        var data =  this.state.theData;
            data[which].word = "hi";
        this.setState({theData: data});
    }
    reset_scene(){
        var data =  this.state.theData;
            for(var i=0; i<data.length; i++){
                data[i].word = databackup[i].word;
            }
        this.setState({theData: data});
    }

    render() {
        const menu = <Menu onItemSelected={ this.onMenuItemSelected } />;
        return (
            <SideMenu
                menu={ menu }
                isOpen={ this.state.isOpen }
                onChange={ (isOpen) => this.updateMenuState(isOpen) } >

                <View style={ [container_styles.container, this.border('black')] }>
                    <View style={ container_styles.game_header }>
                        <Button style={{left: 10}} onPress={ () => this.closeGame() }>
                            <Image source={ require('./images/close.png') } style={ { width: 32, height: 32 } } />
                        </Button>
                        <Text style={styles.header_text} >{this.state.title}
                        </Text>
                        <Button style={{right: 10}} onPress={ () => this.reset_scene() }>
                            <Image source={ require('./images/replay.png') } style={ { width: 32, height: 32 } } />
                        </Button>
                    </View>

                    <View style={ container_styles.clues_container }>



                    </View>

                    <View style={ container_styles.UI_container }>



                    </View>
                    <View style={ container_styles.tiles_container }>
                        { this.drawTiles() }
                    </View>
                    <View style={ container_styles.footer }>
                        <Text style={ styles.copyright }>Some fine print...</Text>
                    </View>
                </View>
            </SideMenu>
        );
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
                onPress={ this.handlePress.bind(this) }
                style={ this.props.style } >
                <Text>{ this.props.children }</Text>
            </TouchableOpacity>
        );
    }
}


var container_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09146d',
    },
    game_header: {
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: window.width,
        backgroundColor: '#3e05a6',
    },
    clues_container: {
        flex: 19,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#09146d',
        borderTopWidth: 2,
        borderTopColor: '#000',
    },
    input_container: {
        flex: 3,
        backgroundColor: 'transparent',
    },
    guess_button_container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    UI_container: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
        flexDirection: 'row',
        width: window.width,
        backgroundColor: '#09146d',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    tiles_container: {
        flex: 21,
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

module.exports = Game;
