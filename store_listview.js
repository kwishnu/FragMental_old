import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, ListView, BackAndroid, AsyncStorage } from 'react-native';
var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');



module.exports = class StoreListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'store',
            isOpen: false,
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
        if (this.state.isOpen) {
            this.toggle();
        }else{
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
        }
        return true;
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
    updateMenuState(isOpen) {
        this.setState({ isOpen });
        if (isOpen) {
            BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        } else {
            BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
        }
    }
    onMenuItemSelected = (item) => {
           this.props.navigator.replace({
               id: 'store',
               passProps: {
                word: item.title,
                puzzleData: this.props.puzzleData
               }
            });
    }


  render() {
        const menu = <Menu onItemSelected={this.onMenuItemSelected} data = {this.props.puzzleData} />;

    return (
        <SideMenu
            menu={ menu }
            isOpen={ this.state.isOpen }
            onChange={ (isOpen) => this.updateMenuState(isOpen) }>

                <View style={store_styles.container}>
                    <Text>{this.props.word}</Text>


                </View>
        </SideMenu>
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

