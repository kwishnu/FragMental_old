import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, BackAndroid, AsyncStorage, Animated, } from 'react-native';

var deepCopy = require('./deepCopy.js');
var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');
var styles = require('./styles');
var {width, height} = require('Dimensions').get('window');
var NUM_WIDE = 4;
var NUM_HIGH = 5;
var CELL_WIDTH = Math.floor(width * .24); // 24% of the screen width
var CELL_HEIGHT = CELL_WIDTH * .55;
var CELL_PADDING = Math.floor(CELL_WIDTH * .08); // 8% of the cell width
var databackup = null;
var dataObject = null;

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'game board',
            isOpen: false,
            title: this.props.title,
            keyFrag: this.props.keyFrag,
            theData: this.props.theData,
            answer_text: '',
            score: 10,
            frag_font_color: 'white',
            score_color: 'white',
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
        //var opacity = this.state.opacity;
        for (var index = 0; index < data.length; ++index) {
            var style = {
                left: (parseInt(data[index].col, 10) * CELL_WIDTH) + CELL_PADDING + 6,
                top: (parseInt(data[index].row, 10) * CELL_HEIGHT) + CELL_PADDING,
                opacity: parseInt(data[index].opacity, 10)
            }
            var text = data[index].frag;
        result.push(this.drawTile(index, style, text));
        }
        return result;
    }
    drawTile(key, position, frag ) {
        return (
            <View  key={ key } style={ [styles.tile, position] } onStartShouldSetResponder={() => this.guess(key)} >
                    <Text style={ styles.puzzle_text_large }>{ frag }</Text>
            </View>
        );
    }
    guess(which) {
        var theFrag = '';
        var data =  this.state.theData;
            if(which==100){
            theFrag ='inc';
            }else{
                var theFrag = data[which].frag;
                data[which].frag = '';
                data[which].opacity = 0;

            }
        var theWord = this.state.answer_text;
        theWord += theFrag;
        this.setState({theData: data});
        this.setState({answer_text: theWord});
    }
    reset_scene(){
        var data =  this.state.theData;
            for(var i=0; i<data.length; i++){
                data[i].frag = databackup[i].frag;
                data[i].opacity = databackup[i].opacity;
            }
        this.setState({theData: data});
        this.setState({answer_text: ''});
    }
    score_increment(){
        var score = parseInt(this.state.score, 10);
        score += 1;
        this.setState({score: score,
                       score_color: 'green',
                      });

    }
    score_decrement(){
        var score = parseInt(this.state.score, 10);
        score -= 1;
        this.setState({score: score,
                       score_color: 'red',
                      });


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

                    <View style={ container_styles.display_area }>
                        <View style={ container_styles.answers_container }>

                        </View>
                        <View style={ container_styles.frag_container } onStartShouldSetResponder={() => this.guess(100)}>
                            <Text style={styles.keyfrag_text} >{this.state.keyFrag}
                            </Text>
                        </View>
                        <View style={ container_styles.clue_container }>
                            <Text style={styles.answer_text} >{this.state.answer_text}
                            </Text>
                        </View>
                    </View>

                    <View style={ container_styles.tiles_container }>
                        { this.drawTiles() }
                    </View>

                    <View style={ container_styles.footer }>
                        <View style={ container_styles.stars_container }>
                            <Image source={ require('./images/star_grey.png') } style={ container_styles.star } />
                            <Image source={ require('./images/star_grey.png') } style={ container_styles.star } />
                        </View>

                        <View style={ container_styles.buttons_container }>
                            <Button style={styles.skip_button} onPress={ () => this.score_decrement() }>
                                <Image source={ require('./images/skip.png')} style={{ width: 36, height: 36 }} />
                            </Button>
                            <Button style={styles.hint_button} onPress={ () => this.score_increment() }>
                                <Image source={ require('./images/question.png')} style={{ width: 36, height: 36 }} />
                            </Button>
                        </View>
                        <View style={ container_styles.stars_container }>
                            <Text style={[styles.answer_text, {right: 10}, {color: this.state.score_color}]} >{this.state.score}
                            </Text>
                        </View>
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
    display_area: {
        flex: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#09146d',
        borderTopWidth: 2,
        borderTopColor: '#000',
    },
    answers_container: {
        flex: 3,
        backgroundColor: 'transparent',
    },
    frag_container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    clue_container: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
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
        flex: 19,
        backgroundColor: '#09146d',
        padding: 10,
    },
    footer: {
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#09146d',
    },
    buttons_container: {
        flexDirection: 'row',
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#09146d',
        padding: 12,
    },
    stars_container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#09146d',
        paddingLeft: 10,
    },
    star: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#09146d',
        width: 20,
        height: 20,
    },
});

module.exports = Game;
