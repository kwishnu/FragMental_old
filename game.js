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
var BORDER_RADIUS = CELL_PADDING * .2;
var TILE_WIDTH = CELL_WIDTH - CELL_PADDING * 2;
var TILE_HEIGHT = CELL_HEIGHT - CELL_PADDING * 2;
var databackup = null;
var dataObject = null;
var SPRING_CONFIG = {tension: 100, velocity: 20};

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'game board',
            isOpen: false,
            title: this.props.title,
            keyFrag: this.props.keyFrag,
            theData: this.props.theData,
            theCluesArray: this.props.theCluesArray,
            currentClue: this.props.theCluesArray[0],
            answer_text: '',
            score: 10,
            onThisClue: 0,
            score_color: 'white',
            pan: new Animated.ValueXY(),
            fadeAnim: new Animated.Value(1),
            goLeft: -140,
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
        var resetOpacity = new Animated.Value(1);
        this.setState({ theData: data,
                        answer_text: '',
                        fadeAnim: resetOpacity,
                        });
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
    skip_to_next(){
        this.score_decrement();
        var cc = this.state.onThisClue;
        cc++;
        cc=(cc == this.props.theCluesArray.length)?0:cc;
        this.setState({currentClue: this.props.theCluesArray[cc],
                       onThisClue: cc,
                        });
    }
    getStyle() {
    return [
              container_styles.word_container,
              {opacity: this.state.fadeAnim},
              {transform: this.state.pan.getTranslateTransform()}
            ];
    }
    animate_word(){
        Animated.sequence([
            Animated.spring(
                this.state.pan, {
                    ...SPRING_CONFIG,
                    toValue: {x: this.state.goLeft, y: -500}
                }),
            Animated.timing(
                this.state.fadeAnim, {
                    toValue: 0,
                    duration: 200,
                }),
        ]).start();
        setTimeout(() => {this.restore_word()}, 1000);
    }
    restore_word(){
        this.setState({answer_text:'',
                       goLeft: -this.state.goLeft,
                      });
        Animated.sequence([
            Animated.spring(
                this.state.pan, {
                    ...SPRING_CONFIG,
                    toValue: {x: 0, y: 0}
                }),
            Animated.timing(
                this.state.fadeAnim, {
                    toValue: 1,
                    duration: 0,
                }),
        ]).start();
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
                        <View style={ container_styles.clue_container }>
                            <Text style={styles.clue_text} >{'Clue ' + parseInt(this.state.onThisClue + 1, 10) + ':  ' + this.state.currentClue.substring(this.state.currentClue.indexOf(':') + 1)}
                            </Text>
                        </View>

                        <View style={ container_styles.word_and_frag }>
                            <View style={ container_styles.frag_container } onStartShouldSetResponder={() => this.guess(100)}>
                                <Text style={styles.keyfrag_text} >{this.state.keyFrag}
                                </Text>
                            </View>
                            <Animated.View style={this.getStyle()}>
                                <Text style={styles.answer_text} >{this.state.answer_text}
                                </Text>
                            </Animated.View>
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
                            <Button style={styles.skip_button} onPress={ () => this.skip_to_next() }>
                                <Image source={ require('./images/skip.png')} style={{ width: 36, height: 36 }} />
                            </Button>
                            <Button style={styles.hint_button} onPress={ () => this.animate_word() }>
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
//        backgroundColor: '#3e05a6',
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
        backgroundColor: '#050e59',
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
        flex: 5,
        backgroundColor: 'transparent',
    },
    clue_container: {
        flex: 5,
        backgroundColor: 'blue',
        width: width - 30,
        padding: 10,
        borderRadius: 10,
        margin: 10,
        justifyContent: 'center',
    },
    word_and_frag: {
        flex: 3,
        flexDirection: 'row',
        padding: 6,
        paddingLeft: 15,
    },
    frag_container: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dedffa',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 2,
        padding: 6,
    },
    word_container: {
        flex: 17,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        paddingLeft: 12,
        padding: 6,
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
