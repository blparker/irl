'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import StatusBar from './statusBar'
import Person from './person';
import userService from './userService';
import q from 'q';

class ShowResultsScene extends Component {

  constructor(props) {
    super(props);

    this.state = {
      personIdx: 0
    };
  }


  componentDidMount() {
    this.goToNextMatch();
  }


  // Clunky render
  render() {

    // If a 'person' property exists in the state, we know we either have loaded the next person or one is being loaded
    if (this.state.person) {
      // If the 'person' property *looks* like a deferred object (i.e., has a 'then' method, then it's loading), so show a loading message
      if (this.state.person.then) {
        return (
          <View>
            <StatusBar />
            <Text>Loading...</Text>
          </View>
        );
      } else {
        // Once the deferred resolves (in the 'goToNextMatch' function), the state is updated with an actual user, so let's render that
        return (
          <View>
            <StatusBar />
            <Person 
              person={this.state.person}
              onMatch={this.onMatch.bind(this)}
              onPass={this.onPass.bind(this)} />
          </View>
        );
      }
    } else {
      // No person appears to exist, so we must be at the end of the list of nearby users
      return (
        <View>
          <StatusBar />
          <Text>That's it</Text>
        </View>
      );
    }

  }


  getUser(userId) {
    return userService.getUserById(userId)
      .then((user) => {
        return q.when(user);
      })
      .catch((error) => {
        console.error(error);
      });
  }


  onMatch(user) {
    console.log('Marking as match: ', user);

    this.goToNextMatch();

    // Update the db to indicate a match was made
    userService.addMatch(user.userId);

    userService.isCurrentUserMatchedToOtherUser(user.userId).then((isMatched) => {
      console.log('Matched? ' + isMatched);
      if (isMatched) {
        // What to do here?
        console.log('Matched');
      }
    });
  }


  onPass(user) {
    console.log('Passing on user: ', user);

    this.goToNextMatch();
  }


  goToNextMatch() {
    if (this.state.personIdx < this.props.nearby.length) {
      let nextProposal = this.props.nearby[this.state.personIdx];
      let nextPersonIdx = this.state.personIdx + 1;

      let userDfd = this.getUser(nextProposal.userId).then(u => {
        this.setState({
          person: u
        });
      });

      this.setState({
        person: userDfd,
        personIdx: nextPersonIdx
      });
    } else {
      this.setState({
        personIdx: -1,
        person: null
      });
    }
  }

}

export default ShowResultsScene;

