import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
var {width, height} = require('Dimensions').get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#191919',
  },
  text: {
    fontSize: 14,
    color: '#FFF056',
  },
});

const SectionHeader = (props) => (
  <View style={styles.container}>
    <Text style={styles.text}>{props.sectionTitle}</Text>
  </View>
);

export default SectionHeader;