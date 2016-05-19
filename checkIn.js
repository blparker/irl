import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import q from 'q';
import userService from './userService';
import geoService from './geoService';

/*var users = [
  { id: '1', username: 'user1', location: { latitude: 41.897065, longitude: -87.6264647 } },
  { id: '2', username: 'user2', location: { latitude: 41.911183, longitude: -87.6339497 } },
  { id: '3', username: 'user3', location: { latitude: 41.8915879, longitude: -87.6148923 } },
  { id: '4', username: 'user4', location: { latitude: 41.89311, longitude: -87.6192057 } }    // current user
];

let findNearby = (usersLocation) => {
  const meters = 6371000;
  const metersInMile = 1609;
  const threshold = 1;

  function toRad(n) {
    return (n * Math.PI / 180);
  }

  let nearby = users.filter(u => {
    let lat1 = usersLocation.latitude;
    let lat2 = u.location.latitude;
    let lon1 = usersLocation.longitude;
    let lon2 = u.location.longitude;

    let x1 = lat2 - lat1;
    let x2 = lon2 - lon1;

    let dLat = toRad(x1);
    let dLon = toRad(x2);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = meters * c;

    var miles = d / metersInMile;
    return miles <= threshold;
  });

  return nearby;
};*/

const STATES = {
  start: '',
  gettingLoc: 'Getting your location...',
  nearby: 'Finding nearby people...',
};

class CheckInScene extends Component {

  constructor(props) {
    super(props);

    //var placesDataSource

    this.state = {
      position: null,
      state: STATES.start,
      nearby: null,
      placesDataSource: null
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to IRL.
        </Text>

        <TouchableOpacity onPress={this._getUsersLocation.bind(this)}>
          <Text>
            Check In
          </Text>
        </TouchableOpacity>

        <Text>{this.state.state}</Text>

        <TouchableOpacity onPress={this._showResults.bind(this)}>
          <Text>
            Show Results
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  _showResults() {
    console.log('Showing results');
    this.props.navigator.push({
      id: 'ShowResultsScene',
      nearbyUsers: this.state.nearby
    });
  }

  _getUsersLocation() {
    this.setState({
      state: STATES.gettingLoc
    });

    geoService.getCurrentLocation()
      .then(p => {
        console.log('Got position: ', p);

        geoService.getPlacesAtCoordinates(p).then((nearbyPlaces) => {
          console.log("Nearby places: ", nearbyPlaces);
          this.setState({
            places: nearbyPlaces
          });
        });

        this.setState({
          state: STATES.nearby
        });

        //userService.registerUsersLocation('user1', [ p.latitude, p.longitude ]);
        //userService.registerUsersLocation('user2', [41.897065, -87.6264647]);
        //userService.registerUsersLocation('user3', [41.911183, -87.6339497]);
        //userService.registerUsersLocation('user4', [41.8915879, -87.6148923]);

        userService.getUsersNearCoordinates({
          latitude: p.latitude,
          longitude: p.longitude
        }).then((nearbyUsers) => {
          // Since the current user is a user in the DB, the current user will identify as a "nearby" user. Filter this current user out of "nearby"
          let currentUserId = userService.currentUser().uid;
          nearbyUsers = nearbyUsers.filter(u => u.userId !== currentUserId);

          console.log('Nearby: ', nearbyUsers);

          this.setState({
            state: STATES.start,
            position: p,
            nearby: nearbyUsers
          });

        });

      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default CheckInScene;

