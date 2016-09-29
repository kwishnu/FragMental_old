import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Animated, Easing, TouchableHighlight } from 'react-native';


//var FragTiles = React.createClass({
class FragTiles extends React.Component{

  render() {
    return <View style={styles.container}>
                <TouchableHighlight  underlayColor='transparent'>
                    <Text style={styles.letter}>{this.props.theWord}</Text>
                </TouchableHighlight>
           </View>
  }

};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09146d',
  },
  letter: {
    color: '#00f',
    fontSize: 40,
    margin: 10,
  },
});



module.exports = FragTiles;