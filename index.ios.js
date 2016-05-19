/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Navigator
} from 'react-native';

import CheckInScene from './checkIn';
import ShowResultsScene from './showResultsScene';


class irl extends Component {

  render() {
    return (
      <Navigator
        initialRoute={{id: 'CheckInScene'}}
        ref='appNavigator'
        renderScene={this._renderScene} />
    );
  }

  _renderScene(route, navigator) {
    let globalNavigatorProps = { navigator }

    switch (route.id) {
      case 'CheckInScene':
        return (
          <CheckInScene {...globalNavigatorProps} />
        );
      case 'ShowResultsScene':
        return (
          <ShowResultsScene {...globalNavigatorProps} nearby={route.nearbyUsers} />
        );
      default:
        console.warn('Route not found');
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('irl', () => irl);

