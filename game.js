import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, BackAndroid, Navigator  } from 'react-native';

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
var menuOpen = null;


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'game board',
            text: 'Hello',
            theWord: 'test',
            isOpen: false,
            code: this.props.code,
            title: this.props.title,
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
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
        for (var row = 0; row < NUM_HIGH; row++) {
            for (var col=0; col<NUM_WIDE; col++) {
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
        return (
            <View  key={ key }>
                <TouchableHighlight
                    style={ [styles.tile, position] }
                    underlayColor='#0F0'
                    onPress={ () => this.show(key) } >

                    <Text style={ styles.letter }>{ key }</Text>
                </TouchableHighlight>
            </View>
        );
    }
    show(which) {
        window.alert(which);
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
                        <Button>
                            <Image source={ require('./images/no_image.png') } style={ { width: 32, height: 32 } } />
                        </Button>
                    </View>
                    <View style={ container_styles.clues_container } />
                    <View style={ container_styles.UI_container } />
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
        backgroundColor: '#09146d',
        borderTopWidth: 2,
        borderTopColor: '#000',
    },
    UI_container: {
        flex: 5,
        alignItems: 'center',
        flexDirection: 'row',
        width: window.width,
        backgroundColor: '#08115d',
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
