import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, ListView, BackAndroid, AsyncStorage } from 'react-native';


module.exports = class StoreListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'store',
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount(){
        BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    componentWillUnmount () {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    handleHardwareBackButton() {
        try {
            this.props.navigator.pop({
                id: 'puzzles contents',
                passProps: {
                    puzzleData: this.props.puzzleData,
                }
            });
        }
        catch(err) {
            window.alert(err.message);
        }
        return true;
    }


  render() {

    return (
                <View style={store_styles.container}>
                    <Text>{this.props.word}</Text>


                </View>
    );
  }
};


const store_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

