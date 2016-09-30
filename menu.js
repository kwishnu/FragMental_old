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
          onPress={() => this.props.onItemSelected('Item 1')}
          style={styles.item}>
          Item 1
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('Item 2')}
          style={styles.item}>
          Item 2
        </Text>
      </ScrollView>
    );
  }
}