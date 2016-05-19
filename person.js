'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

class PersonScene extends Component {
  constructor(props) {
    super(props);
  }


  render() {

    return (
      <View>
        <Text>{this.props.person.name}</Text>

        <TouchableOpacity onPress={this._onYeaPressed.bind(this)}>
          <Text>Yea</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this._onNayPressed.bind(this)}>
          <Text>Nay</Text>
        </TouchableOpacity>
      </View>
    );
  }


  _onYeaPressed() {
    console.log('Yea pressed');
    this.props.onMatch(this.props.person);
  }


  _onNayPressed() {
    console.log('Nay pressed');
    this.props.onPass(this.props.person);
  }
}

export default PersonScene;

