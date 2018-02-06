'use strict';

import faker from 'faker';

import Profile from '../../src/model/profile';
import userMockFactory from './user-mock-factory';

const profileMockFactory = module.exports = {};

profileMockFactory.create = () => {
  let mock = {};
  mock.request = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };
  return Profile.create(
    mock.request.firstName,
    mock.request.lastName,
  )
    .then(profile => {
      mock.profile = profile;
    })
    .catch(console.log);
};

profileMockFactory.createWithUser = () => {
  let mock = {};
  return userMockFactory.create()
    .then(userMock => {
      mock.user = userMock.user;
      mock.userToken = userMock.token;
      return profileMockFactory.create();
    })
    .then(user => {
      mock.profile = user.profile;
      return mock;
    })
    .catch(console.log);
};
