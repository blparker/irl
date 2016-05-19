'use strict';

import config from './config';
import Firebase from 'firebase';
import GeoFire from 'geofire';
import q from 'q';

const ONE_MILE = 1.60934;

class UserService {
  constructor(firebaseUrl) {
    this.firebaseUrl = firebaseUrl;
    this.db = null;
    this.geoDb = null;

    this._connect();
  }


  getUsersNearCoordinates(coordinates) {
    let dfd = q.defer();

    let query = this.geoDb.query({
      center: [ coordinates.latitude, coordinates.longitude ],
      radius: ONE_MILE
    });

    var nearby = [];
    query.on('key_entered', (key, loc) => {
      console.log(key, loc);

      nearby.push({ userId: key });
    });

    query.on('ready', () => {
      console.log('ready');
      dfd.resolve(nearby);
    });

    return dfd.promise;
  }


  getUserById(userId) {
    let dfd = q.defer();

    this.db.child('users/' + userId).on('value',
      (snapshot) => {
        let user = snapshot.val();
        // 'userId' is the key and not stored with the object, so add it back
        user.userId = snapshot.key();

        dfd.resolve(user);
      },
      (error) => {
        dfd.reject(new Error('Error: ' + error.code));
      }
    );

    return dfd.promise;
  }


  registerUsersLocation(userId, location) {
    this.geoDb.set(userId, location).then(
      () => {
        console.log('Set location in firebase');
      },
      (error) => {
        console.error('Error: ', error);
      }
    );
  }


  isCurrentUserMatchedToOtherUser(otherUserId) {
    var currentUserId = this.currentUser().uid;
    var dfd = q.defer();

    this.db.child('matches').child(currentUserId).child(otherUserId).on('value', (snapshot1) => {
      if (! snapshot1.exists()) {
        dfd.resolve(false);
        return;
      }

      this.db.child('matches').child(otherUserId).child(currentUserId).on('value', (snapshot2) => {
        if (snapshot2.exists()) {
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });
    });

    return dfd.promise;
  }


  // Apparently the current user matched with someone (lucky you), so add that to the database
  addMatch(matchedUserId) {
    var currentUserId = this.currentUser().uid;
    var dfd = q.defer();

    var match = {};
    match[matchedUserId] = {
      date: new Date().getTime()
    };

    this.db.child('matches').child(currentUserId).set(match, (error) => {
      if (error) {
        dfd.reject(error);
      } else {
        dfd.resolve();
      }
    });

    return dfd.promise;
  }


  currentUser() {
    // Should use ref.getAuth().uid
    return { uid: 'user1' };
  }


  // Create a Firebase and GeoFire connection
  _connect() {
    this.db = new Firebase(this.firebaseUrl);
    this.geoDb = new GeoFire(this.db.child('locations'));
  }

}


let firebaseUrl = config.firebaseUrl;
export default new UserService(firebaseUrl);

