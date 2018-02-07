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
    });
};

profileMockFactory.createWithUser = () => {
  let mock = {};
  return userMockFactory.create()
    .then(user => {
      mock.user = user;
      const profileRequest = {
        account_id: user._id,
        firstName: faker.name.firstName,
        lastName: faker.name.lastName,
      };
      return Profile.create(profileRequest);
    })
    .then(profile => {
      mock.profile = profile;
      return mock;
    });
};
