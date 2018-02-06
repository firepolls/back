import User from './user.js';
import Profile from './profile.js';

export default (db) => {
  User(db);
  Profile(db);
};

