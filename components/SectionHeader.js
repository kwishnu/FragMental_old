import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
var {width, height} = require('Dimensions').get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0000FF',
    borderRadius: 20,

  },
  text: {
    fontSize: 20,
    color: '#FFF600',
  },
});

const SectionHeader = (props) => (
  <View style={styles.container}>
    <Text style={styles.text}>{props.sectionTitle}</Text>
  </View>
);

export default SectionHeader;