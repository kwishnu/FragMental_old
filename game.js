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
            <Text style={styles.letter} >{ this.state.text }</Text>
        </View>
    );
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

module.exports = Game;