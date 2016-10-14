import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, ListView, BackAndroid, Animated  } from 'react-native';

var data = require('./data.js');
var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');
var styles = require('./styles');
var {width, height} = require('Dimensions').get('window');
var NUM_WIDE = 5;
var NUM_ROWS = 10;
var CELL_WIDTH = Math.floor(width/NUM_WIDE); // one tile's fraction of the screen width
var CELL_PADDING = Math.floor(CELL_WIDTH * .05) + 5; // 5% of the cell width...+
var TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2) - 7;
var BORDER_RADIUS = CELL_PADDING * .2 + 3;

class PuzzleLaunch extends React.Component{
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            id: 'puzzle launcher',
            isOpen: false,
            dataSource: ds.cloneWithRows(Array.from(new Array(NUM_WIDE * NUM_ROWS), (x,i) => i+1)),
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    setLauncherProps() {
        var tilt = new Array(NUM_WIDE * NUM_ROWS);
        for (var i = 0; i < tilt.length; i++) {
          tilt[i] = new Animated.Value(0);
        }
            var opacities = new Array(NUM_WIDE * NUM_ROWS);
            for (var i = 0; i < opacities.length; i++) {
              opacities[i] = new Animated.Value(1);
            }
        return {tilt, opacities};
    }
    handleHardwareBackButton() {
        if (this.state.isOpen) {
            this.toggle();
            return true;
        }
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
    onSelect(passed) {
        this.props.navigator.replace({
            id: 'game board',
            passProps: {
                title: passed,
                code: 'Foo',
                theData: data,
                },
       });
    }

    render() {
        const menu = <Menu onItemSelected={ this.onMenuItemSelected } />;
        this.setLauncherProps();

        return (
            <SideMenu
                menu={ menu }
                isOpen={ this.state.isOpen }
                onChange={ (isOpen) => this.updateMenuState(isOpen) }>

                <View style={ [container_styles.container, this.border('black')] }>
                    <View style={ container_styles.header }>
                        <Button style={{left: 10}} onPress={ () => this.toggle() }>
                            <Image source={ require('./images/menu.png') } style={ { width: 32, height: 32 } } />
                        </Button>
                        <Text style={styles.header_text} >Asparagus
                        </Text>
                        <Button>
                            <Image source={ require('./images/no_image.png') } style={ { width: 32, height: 32 } } />
                        </Button>
                    </View>
                    <View style={ [container_styles.tiles_container, this.border('black')] }>
                         <ListView initialListSize ={100} contentContainerStyle={ container_styles.listview } dataSource={this.state.dataSource}
                         renderRow={(rowData) =>
                             <View>
                             <TouchableHighlight  onPress={ () => this.onSelect(rowData.toString()) } style={ container_styles.launcher } underlayColor='#0F0' >
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
    launcher: {
        width: TILE_WIDTH,
        height: TILE_WIDTH,
        borderRadius: BORDER_RADIUS,
        margin: CELL_PADDING,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dedffa',
    },
});

module.exports = PuzzleLaunch;
