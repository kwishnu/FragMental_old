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
var dataBackup = null;
var dataObject = null;
var SPRING_CONFIG = {tension: 10, velocity: 10};
var timeoutHandle;

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
            solvedArray: new Array(this.props.theCluesArray.length),
            currentClue: this.props.theCluesArray[0],
            currentFrags: this.props.theCluesArray[0].substring(0, this.props.theCluesArray[0].indexOf(':')),
            numFrags:  (this.props.theCluesArray[0].substring(0, this.props.theCluesArray[0].indexOf(':')).split('|')).length,
            answer_text: '',
            score: 10,
            onThisClue: 0,
            onThisFrag: 0,
            score_color: 'white',
            fragOpacity: 1,
            pan: new Animated.ValueXY(),
            fadeAnim: new Animated.Value(1),
            goLeft: 100,
            columnSort: -1,
            answer0: '',
            answer1: '',
            answer2: '',
            answer3: '',
            answer4: '',
            answer5: '',
            answer6: '',
            answer7: '',
            puzzle_solved: false,
            bgColor: '#09146d',
            starImage1: require('./images/star_grey.png'),
            starImage2: require('./images/star_grey.png'),
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        var arr = Array(this.state.solvedArray.length).fill('');
        dataBackup = owl.deepCopy(this.props.theData);
        BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        this.setState({solvedArray: arr})
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
            <View  key={ key } style={ [styles.tile, position] } onStartShouldSetResponder={() => this.guess(key, 1)} >
                    <Text style={ styles.puzzle_text_large }>{ frag }</Text>
            </View>
        );
    }
    guess(which, howMuchToScore) {
        var solved = this.state.puzzle_solved;
            if(solved)return;

        var entire_puzzle_solved = false;
        var theFrag = '';
        var scoreToAdd = 1;
        var data =  this.state.theData;
        var onClue = this.state.onThisClue;
        var currClue = this.state.currentClue;
        var gl = this.state.goLeft;
        var colSort = this.state.columnSort;

        if(which==100){
            theFrag = this.props.keyFrag;
        }else{
            var theFrag = data[which].frag;
        }
        var guessFragsArray = this.state.currentFrags.split('|');
        var onFrag = this.state.onThisFrag;
        if(theFrag == guessFragsArray[onFrag] || (theFrag == this.props.keyFrag && guessFragsArray[onFrag] == '^')){
            if(which<100){
                data[which].frag = '';
                data[which].opacity = 0;
            }
            var theWord = this.state.answer_text;
            theWord += theFrag;
            onFrag++;
            var newCurrentFrags = currClue.substring(0, currClue.indexOf(':'));
            var newNumFrags = (currClue.substring(0, currClue.indexOf(':')).split('|')).length;
            var sArray = this.state.solvedArray;
            solved = (onFrag ==  this.state.numFrags)?true:false;

            if(solved){
                onFrag  = 0;
                scoreToAdd = 3;
                sArray[onClue]='solved';
                entire_puzzle_solved = true;
                colSort++;
                gl = -gl;

                for(goThru_sArray=onClue + 1;goThru_sArray<onClue + sArray.length;goThru_sArray++){
                    if(sArray[goThru_sArray % sArray.length]==''){
                        onClue = goThru_sArray % sArray.length;
                        currClue =  this.props.theCluesArray[onClue]
                        entire_puzzle_solved = false;
                        newCurrentFrags = currClue.substring(0, currClue.indexOf(':'));
                        newNumFrags = (currClue.substring(0, currClue.indexOf(':')).split('|')).length;

                        break;
                    }
                }
                if (entire_puzzle_solved){
                    currClue = (this.state.score < 20)?'1':'2';
                }
            }
            this.setState({ theData: data,
                            answer_text: theWord,
                            onThisClue: onClue,
                            onThisFrag: onFrag,
                            currentFrags: newCurrentFrags,
                            numFrags: newNumFrags,
                            puzzle_solved: entire_puzzle_solved,
                            solvedArray: sArray,
                            goLeft: gl,
                            columnSort: colSort,
                            });
            if(howMuchToScore>0) {
                this.score_increment(scoreToAdd);
            }else{
                this.score_decrement(scoreToAdd);
            }
        }else{
            this.score_decrement(1);
        }
        if (solved){
            setTimeout(() => {this.animate_word(currClue)}, 20);
        };
    }
    reset_scene(){
        var data =  this.state.theData;
            for(var i=0; i<data.length; i++){
                data[i].frag = dataBackup[i].frag;
                data[i].opacity = dataBackup[i].opacity;
            }
        var arr = Array(this.state.solvedArray.length).fill('');
        var resetOpacity = new Animated.Value(1);
        setTimeout(() => {this.changeStarImage(0)}, 50);
        this.setState({ theData: data,
                        answer_text: '',
                        fadeAnim: resetOpacity,
                        goLeft: 100,
                        columnSort: -1,
                        onThisClue: 0,
                        onThisFrag: 0,
                        currentClue: this.props.theCluesArray[0],
                        currentFrags: this.props.theCluesArray[0].substring(0, this.props.theCluesArray[0].indexOf(':')),
                        numFrags:  (this.props.theCluesArray[0].substring(0, this.props.theCluesArray[0].indexOf(':')).split('|')).length,
                        solvedArray: arr,
                        score: 10,
                        score_color: 'white',
                        answer0: '',
                        answer1: '',
                        answer2: '',
                        answer3: '',
                        answer4: '',
                        answer5: '',
                        answer6: '',
                        answer7: '',
                        answer8: '',
                        answer9: '',
                        puzzle_solved: false,
                        bgColor: '#09146d',
                    });
    }
    score_increment(howMuch){
        var score = parseInt(this.state.score, 10);
        score += howMuch;
        this.setState({score: score,
                       score_color: 'green',
                      });
    }
    score_decrement(howMuch){
        var score = parseInt(this.state.score, 10);
        score -= howMuch;
        score = (score < 0)?0:score;
        var bgc = (score < 1)?'#cd0404':'#09146d';
        this.setState({score: score,
                       score_color: 'red',
                       bgColor: bgc,
                      });
    }
    skip_to_next(){
        var solved = this.state.puzzle_solved;
            if(solved)return;
        var onFrag = this.state.onThisFrag;
        if(onFrag > 0){
            this.give_hint();
        }else{
            var onClue = this.state.onThisClue;
            var currClue = this.state.currentClue;
            var sArray = this.state.solvedArray;
            var onClue = 0;
            var newCurrentFrags = currClue.substring(0, currClue.indexOf(':'));
            var newNumFrags = (currClue.substring(0, currClue.indexOf(':')).split('|')).length;

            for(goThru_sArray=this.state.onThisClue + 1;goThru_sArray<this.state.onThisClue + sArray.length;goThru_sArray++){
                if(sArray[goThru_sArray % sArray.length]==''){
                    onClue = goThru_sArray % sArray.length;
                    currClue =  this.props.theCluesArray[onClue]
                    newCurrentFrags = currClue.substring(0, currClue.indexOf(':'));
                    newNumFrags = (currClue.substring(0, currClue.indexOf(':')).split('|')).length;

                    break;
                }
            }
            this.setState({ currentClue: currClue,
                            onThisClue: onClue,
                            onThisFrag: onFrag,
                            currentFrags: newCurrentFrags,
                            numFrags: newNumFrags,
                            });
        }
    }
    give_hint(){
        var solved = this.state.puzzle_solved;
            if(solved)return;
        var data =  this.state.theData;
        var guessFragsArray = this.state.currentFrags.split('|');
        var onFrag = this.state.onThisFrag;

        if(guessFragsArray[onFrag] == '^'){
            this.guess(100, -1);
            return;
        }
        for(var goThruData = 0; goThruData<data.length; goThruData++){
            if(data[goThruData].frag == guessFragsArray[onFrag]){
            this.guess(goThruData, -1);
            return;
            }
        }
    }
    getStyle() {
    return [
              container_styles.word_container,
              {opacity: this.state.fadeAnim},
              {transform: this.state.pan.getTranslateTransform()}
            ];
    }
    animate_word(newClue){
        Animated.parallel([
            Animated.spring(
                this.state.pan, {
                    ...SPRING_CONFIG,
                    toValue: {x: this.state.goLeft, y: -height/2}
                }),
            Animated.timing(
                this.state.fadeAnim, {
                    toValue: 0,
                    duration: 200,
                }),
        ]).start(this.call_set_column(newClue));

        setTimeout(() => {this.restore_word()}, 400);
    }
    restore_word(){
        this.setState({ answer_text:''});
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
    call_set_column(newClue){
        setTimeout(() => {this.set_column_word(newClue)}, 200);

    }
    set_column_word(newClue){
        switch(this.state.columnSort){
            case 0:
                this.setState({ answer0: this.state.answer_text, currentClue: newClue});
                break;
            case 1:
                this.setState({ answer1: this.state.answer_text, currentClue: newClue});
                break;
            case 2:
                this.setState({ answer2: this.state.answer_text, currentClue: newClue});
                break;
            case 3:
                this.setState({ answer3: this.state.answer_text, currentClue: newClue});
                break;
            case 4:
                this.setState({ answer4: this.state.answer_text, currentClue: newClue});
                break;
            case 5:
                this.setState({ answer5: this.state.answer_text, currentClue: newClue});
                break;
            case 6:
                this.setState({ answer6: this.state.answer_text, currentClue: newClue});
                break;
            case 7:
                this.setState({ answer7: this.state.answer_text, currentClue: newClue});
                break;
            case 8:
                this.setState({ answer8: this.state.answer_text, currentClue: newClue});
                break;
            case 9:
                this.setState({ answer9: this.state.answer_text, currentClue: newClue});
                break;
            default:
        }
    }
    getClueText(){
        var textToReturn = '';
        var currClue = this.state.currentClue;
        if (currClue.indexOf(':') > 0){
            textToReturn = 'Clue ' + parseInt(this.state.onThisClue + 1, 10) + ':  ' + currClue.substring(currClue.indexOf(':') + 1)
        }else{
           if (currClue == '1'){
                textToReturn = 'Congratulations...one star for solving the puzzle!';
                timeoutHandle = setTimeout(() => {this.changeStarImage(1)}, 50);
            }else{
                textToReturn = 'Excellent:  you get both stars for solving the puzzle with ' + this.state.score + ' points!';
                timeoutHandle = setTimeout(() => {this.changeStarImage(2)}, 50);
            }
        }
        return textToReturn;
    }
    changeStarImage(howMany){
        switch(howMany){
            case 0:
                this.setState({
                    starImage1: require('./images/star_grey.png'),
                    starImage2: require('./images/star_grey.png'),
                    fragOpacity: 1,
                });
                break;
            case 1:
                this.setState({
                    starImage1: require('./images/star_green.png'),
                    fragOpacity: 0
                });
                break;
            case 2:
                this.setState({
                    starImage1: require('./images/star_green.png'),
                    starImage2: require('./images/star_green.png'),
                    fragOpacity: 0
                });
                break;
            default:
        }
        clearTimeout(timeoutHandle);

    }

    render() {
        const menu = <Menu onItemSelected={ this.onMenuItemSelected } />;
        return (
            <SideMenu
                menu={ menu }
                isOpen={ this.state.isOpen }
                onChange={ (isOpen) => this.updateMenuState(isOpen) } >

                <View style={ [container_styles.container, {backgroundColor: this.state.bgColor}, this.border('black')] }>
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
                            <View style={ container_styles.answers_column }>
                                <Text style={styles.answer_column_text}>{this.state.answer0}</Text>
                                <Text style={styles.answer_column_text}>{this.state.answer2}</Text>
                                <Text style={styles.answer_column_text}>{this.state.answer4}</Text>
                                <Text style={styles.answer_column_text}>{this.state.answer6}</Text>
                                <Text style={styles.answer_column_text}>{this.state.answer8}</Text>
                            </View>
                            <View style={ container_styles.answers_column }>
                                <Text style={styles.answer_column_text}>{this.state.answer1}</Text>
                                <Text style={styles.answer_column_text}>{this.state.answer3}</Text>
                                <Text style={styles.answer_column_text}>{this.state.answer5}</Text>
                                <Text style={styles.answer_column_text}>{this.state.answer7}</Text>
                                <Text style={styles.answer_column_text}>{this.state.answer9}</Text>
                            </View>

                        </View>
                        <View style={ container_styles.clue_container }>
                            <Text style={styles.clue_text} >{this.getClueText()}
                            </Text>
                        </View>

                        <View style={ container_styles.word_and_frag }>
                            <View style={ [container_styles.frag_container, {opacity: this.state.fragOpacity}] } onStartShouldSetResponder={() => this.guess(100, 1)}>
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
                            <Image source={this.state.starImage1} style={ container_styles.star } />
                            <Image source={this.state.starImage2} style={ container_styles.star } />
                        </View>

                        <View style={ container_styles.buttons_container }>
                            <Button style={styles.skip_button} onPress={ () => this.skip_to_next() }>
                                <Image source={ require('./images/skip.png')} style={{ width: 36, height: 36 }} />
                            </Button>
                            <Button style={styles.hint_button} onPress={ () => this.give_hint() }>
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
        backgroundColor: 'transparent',
        borderTopWidth: 2,
        borderTopColor: '#000',
    },
    answers_container: {
        flex: 14,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    answers_column: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    clue_container: {
        flex: 9,
        backgroundColor: 'blue',
        width: width - 30,
        padding: 10,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    word_and_frag: {
        flex: 6,
        flexDirection: 'row',
        marginBottom: 3,
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
        paddingBottom: 8,
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
        backgroundColor: 'transparent',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    tiles_container: {
        flex: 19,
        backgroundColor: 'transparent',
        padding: 10,
    },
    footer: {
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    buttons_container: {
        flexDirection: 'row',
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 12,
    },
    stars_container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingLeft: 10,
    },
    star: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: 20,
        height: 20,
    },
});

module.exports = Game;
