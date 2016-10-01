import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, Image, TouchableOpacity } from 'react-native';

const styles = require('./styles');

module.exports = class Menu extends Component {
  static propTypes = {
    onItemSelected: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <View style={styles.avatarContainer}>
          <Text style={styles.name}>'Heading'</Text>
        </View>

        <Text
          onPress={() => this.props.onItemSelected('Puzzle Launch Page')}
          style={styles.item}>
          Puzzle Launch Page
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('A Puzzle')}
          style={styles.item}>
          A Puzzle
        </Text>
      </ScrollView>
    );
  }
}