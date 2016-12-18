import React, { PropTypes } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Navigator} from 'react-native';
import { MeteorListView } from 'react-native-meteor';
var selected =  require('./puzzles_contents');
//import { Navigator } from 'react-native';
import AppNavigator from './app_navigator';
//import Loading from '../../components/Loading';
//import styles from './styles';
var {width, height} = require('Dimensions').get('window');
var NUM_WIDE = 1;
var NUM_ROWS = 10;
var CELL_WIDTH = Math.floor(width/NUM_WIDE); // one tile's fraction of the screen width
var CELL_PADDING = Math.floor(CELL_WIDTH * .05) + 5; // 5% of the cell width...+
var TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2) - 7;
var BORDER_RADIUS = CELL_PADDING * .2 + 3;

const Puzzles = ({ puzzlesReady, navigator }) => {
  if (!puzzlesReady) {
    return null;//<Loading />;
  }else{

  return (
    <View style={launcherStyle.container}>
        <MeteorListView
            showsVerticalScrollIndicator ={false}
            enableEmptySections ={true}
            //contentContainerStyle={todo.container}
            collection="dataJ"//"dataJ""puzzles"
            renderRow={
                (item) =>
                <View>
                    <TouchableHighlight style={launcherStyle.launcher} onPress={()=>select(item.text, navigator)}>
                         <Text style={launcherStyle.text}>{item.text}</Text>
                    </TouchableHighlight>
                </View>
             }
        />
    </View>
  );
 };
};

select = (sent, nav) => {
nav.replace({
            id: 'puzzle launcher',
            passProps: {
                title: sent,
                },
       })
};

Puzzles.propTypes = {
  puzzlesReady: PropTypes.bool,
  id: PropTypes.string,
};

var launcherStyle = StyleSheet.create({
    launcher: {
        width: TILE_WIDTH,
        height: TILE_WIDTH * .25,
        borderRadius: BORDER_RADIUS,
        borderWidth: 1,
        margin: CELL_PADDING,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#079707",
    },
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        color: '#fff',
        fontSize: 18,
    },

});

export default Puzzles;
