import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TextInput } from 'react-native';

class Game extends Component{
  constructor(props) {
    super(props);
    this.state = {text: 'Hello'};
  }
  render() {
    return (
        <View style={styles.container}>
            <Text style={styles.letter}>Hello!</Text>
        </View>
    );
  }
};



var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //marginTop: 0,
    alignItems: 'center',
    backgroundColor: '#09146d',
  },
  tile: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BEE1D2',
  },
  letter: {
    color: '#00f',
    fontSize: 40,
    margin: 10,
  },
});

module.exports = Game;